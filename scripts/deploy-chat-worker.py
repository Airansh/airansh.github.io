"""Deploy the chat Worker using a destination-scoped environment credential.

Secret values are never written to disk or printed. Existing Worker secrets survive uploads.
"""
import json
import os
from pathlib import Path
import secrets
import urllib.error
import urllib.request
import uuid

ROOT = Path(__file__).resolve().parent.parent
TOKEN = os.environ['CLOUDFLARE_API_TOKEN']
NAME = 'vedansh-portfolio-chat'

def api(path, method='GET', body=None, content_type='application/json'):
    if isinstance(body, dict):
        body = json.dumps(body).encode()
    request = urllib.request.Request('https://api.cloudflare.com/client/v4' + path, data=body, method=method,
        headers={'Authorization': 'Bearer ' + TOKEN, 'Content-Type': content_type, 'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            data = json.load(response)
    except urllib.error.HTTPError as error:
        try:
            data = json.load(error)
        except ValueError:
            raise SystemExit(f'Cloudflare returned HTTP {error.code}.') from None
        messages = [{'code': item.get('code'), 'message': item.get('message') if not path.endswith('/secrets') else 'Secret update failed.'} for item in data.get('errors', [])]
        raise SystemExit(json.dumps({'http_status': error.code, 'errors': messages})) from None
    if not data.get('success'):
        raise SystemExit(json.dumps({'operation': method + ' ' + path, 'error_codes': [item.get('code') for item in data.get('errors', [])]}))
    return data.get('result')

accounts = api('/accounts')
account_id = os.environ.get('CLOUDFLARE_ACCOUNT_ID')
if not account_id:
    if len(accounts) != 1:
        raise SystemExit('Set the non-secret CLOUDFLARE_ACCOUNT_ID to select the intended account.')
    account_id = accounts[0]['id']
base = f'/accounts/{account_id}/workers/scripts/{NAME}'
scripts = api(f'/accounts/{account_id}/workers/scripts')
script = next((item for item in scripts if item.get('id') == NAME), None)
if script is None:
    raise SystemExit('Provision the intended Worker before deploying the chat implementation.')
settings = api(base + '/settings')
bindings = settings.get('bindings', [])
if not any(binding.get('name') == 'GEMINI_API_KEY' and binding.get('type') == 'secret_text' for binding in bindings):
    raise SystemExit('Add GEMINI_API_KEY as an encrypted Worker secret before deploying chat.')
if not any(binding.get('name') == 'RATE_LIMIT_SALT' for binding in bindings):
    api(base + '/secrets', 'PUT', {'name': 'RATE_LIMIT_SALT', 'type': 'secret_text', 'text': secrets.token_urlsafe(32)})
    print('Created encrypted rate-limit salt.')

metadata = {
    'main_module': 'index.mjs',
    'compatibility_date': '2026-10-13',
    'keep_bindings': ['secret_text'],
    'bindings': [
        {'name': 'CHAT_ENABLED', 'type': 'plain_text', 'text': 'true'},
        {'name': 'CHAT_QUOTA', 'type': 'durable_object_namespace', 'class_name': 'ChatQuota'},
    ],
    'observability': {'enabled': False},
}
if not script.get('migration_tag'):
    metadata['migrations'] = {'new_tag': 'chat-quota-v1', 'new_sqlite_classes': ['ChatQuota']}
elif script['migration_tag'] != 'chat-quota-v1':
    raise SystemExit('Unrecognized Durable Object migration tag; stopped for inspection.')

boundary = 'portfolio-' + uuid.uuid4().hex
parts = []
modules = [('metadata', 'metadata.json', 'application/json', json.dumps(metadata).encode())]
for filename in ['index.mjs', 'context.mjs', 'portfolio-context.mjs', 'quota.mjs', 'stream.mjs']:
    modules.append((filename, filename, 'application/javascript+module', (ROOT / 'worker' / filename).read_bytes()))
for field, filename, content_type, content in modules:
    parts.extend([f'--{boundary}\r\n'.encode(),
        f'Content-Disposition: form-data; name="{field}"; filename="{filename}"\r\n'.encode(),
        f'Content-Type: {content_type}\r\n\r\n'.encode(), content, b'\r\n'])
parts.append(f'--{boundary}--\r\n'.encode())
api(base, 'PUT', b''.join(parts), 'multipart/form-data; boundary=' + boundary)
api(base + '/subdomain', 'POST', {'enabled': True, 'previews_enabled': False})
subdomain = api(f'/accounts/{account_id}/workers/subdomain')['subdomain']
print(json.dumps({'worker': NAME, 'url': f'https://{NAME}.{subdomain}.workers.dev', 'secrets_preserved': True}))
