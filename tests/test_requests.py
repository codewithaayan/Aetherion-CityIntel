import pytest


@pytest.mark.parametrize("route", ["simulate", "ai-analysis"])
def test_missing_post_components(client, route):
    response = client.post(f"/api/areas/test-area/{route}", json={})
    assert response.status_code == 503
    assert response.json()["error"]["code"].endswith("not_configured")


@pytest.mark.parametrize("body", ['[]', 'null', '"string"', '{', '{"x":NaN}', '{"x":Infinity}', '{"x":1e999}'])
def test_invalid_json(client, body):
    response = client.post("/api/areas/test-area/simulate", content=body,
                           headers={"Content-Type": "application/json"})
    assert response.status_code == 422


def test_invalid_id(client):
    assert client.get("/api/areas/" + "a" * 129).status_code == 422


def test_body_limit(client):
    response = client.post("/api/areas/test-area/simulate", json={"x": "a" * 2000})
    assert response.status_code == 413


def test_chunked_body_limit(client):
    response = client.post("/api/areas/test-area/simulate", content=iter([b"{" * 600, b"a" * 600]),
                           headers={"Content-Type": "application/json"})
    assert response.status_code == 413


def test_content_type(client):
    assert client.post("/api/areas/test-area/simulate", content="{}").status_code == 415


def test_cors_and_host_access(client):
    allowed = client.options("/api/cities", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert allowed.headers["access-control-allow-origin"] == "http://localhost:3000"
    denied = client.options("/api/cities", headers={"Origin": "https://unapproved.invalid", "Access-Control-Request-Method": "POST"})
    assert "access-control-allow-origin" not in denied.headers
    assert client.get("/api/cities", headers={"Host": "unapproved.invalid"}).status_code == 400
    assert client.get("/api/cities").headers["Cache-Control"] == "no-store"
