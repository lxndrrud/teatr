from fastapi.testclient import TestClient
from ...main import app
import json

client = TestClient(app)

item_id = 0
new_item_id = 0

def test_get_all():
    # success 200
    global item_id
    response = client.get('/plays')
    json_ = response.json()
    assert response.status_code == 200
    assert json_[0]['title'] == 'Test title'
    assert json_[0]['description'] == 'Test desc'
    item_id = json_[0]['id'] 

def test_get_single():
    # success 200
    response = client.get(f'/plays/{item_id}')
    json_ = response.json()
    assert response.status_code == 200
    assert json_['title'] == 'Test title'
    assert json_['description'] == 'Test desc'

    # fail 404
    response = client.get(f'/plays/0')
    json_ = response.json()
    assert response.status_code == 404



def test_post_plays():
    global new_item_id
    response = client.post('/plays', json={
        "title": "Test 2",
        "description": "Test desc"
    })
    headers = response.headers
    assert response.status_code == 201
    #new_item_id = int(headers['Location'].split('/')[1])
    new_item_id = int(response.json()['id'])

def test_delete_play():
    global new_item_id
    response = client.delete(f'/plays/{new_item_id}')
    assert response.status_code == 200

