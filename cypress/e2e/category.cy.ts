describe('Category API E2E Tests', () => {
  const apiUrl = 'https://marketplace-backend-delta.vercel.app';
  let accessToken = '';
  let categoryId = '';
  let nonexistentCategoryId = '123e4567-e89b-12d3-a456-426614174000';
  let falseAccessToken = '321e4567-e8b9-1d23-a456-421664170040';

  const mockAdmin = {
    email: 'admin@example.com',
    password: 'Password123!'
  }

  before(() => {
    cy.request('POST', `${apiUrl}/auth/login`, mockAdmin).then((response) => {
      accessToken = response.body.access_token;
    });
  });

  it('should create a category successfully', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/categories/create`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: 'Test category',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      categoryId = response.body.id;
    });
  });

  it('should not create a category that already exists', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/categories/create`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: 'Test Category',
      },
    }).then((response) => {
      expect(response.status).to.eq(409);
    });
  });

  it('should get all categories successfully', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/categories`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should not get all categories if not authorized', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/categories`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${falseAccessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('should update a category successfully', () => {
    cy.request({
      method: 'PUT',
      url: `${apiUrl}/categories/${categoryId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: 'Updated Category',
      },
    }).then((updateResponse) => {
      expect(updateResponse.status).to.eq(200);
      expect(updateResponse.body.name).to.eq('Updated Category');
    });
  });

  it('should not update a category that does not exists', () => {
    cy.request({
      method: 'PUT',
      url: `${apiUrl}/categories/${nonexistentCategoryId}`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: 'Updated Category',
      },
    }).then((updateResponse) => {
      expect(updateResponse.status).to.eq(404);
    });
  });

  it('should delete a category successfully', () => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/categories/${categoryId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200);
    });
  });

  it('should not delete a category that does not exists', () => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/categories/${nonexistentCategoryId}`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(404);
    });
  });
});
