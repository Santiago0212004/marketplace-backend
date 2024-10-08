describe('Subcategory API E2E Tests', () => {
  const apiUrl = 'https://marketplace-backend-production-d4eb.up.railway.app';
  let accessToken = '';
  let categoryId = '';
  let subcategoryId = '';
  let nonexistentSubcategoryId = '123e4567-e89b-12d3-a456-426614174000';
  let nonexistentCategoryId = '321e4567-e89b-12d3-a456-426614174111';
  let falseAccessToken = '321e4567-e8b9-1d23-a456-421664170040';

  const mockAdmin = {
    email: 'admin@example.com',
    password: 'Password123!'
  }

  before(() => {
    cy.request('POST', `${apiUrl}/auth/login`, mockAdmin).then((response) => {
      accessToken = response.body.access_token;

      cy.request({
        method: 'POST',
        url: `${apiUrl}/categories/create`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          name: 'Test Category for subcategories',
        },
      }).then((response) => {
        categoryId = response.body.id;
      });
    });
  });

  it('should create a subcategory successfully', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/subcategories/create`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: 'Test Subcategory',
        categoryId: categoryId,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      subcategoryId = response.body.id;
    });
  });

  it('should not create a subcategory that already exists', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/subcategories/create`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: 'Test Subcategory', // Same name as the one created above
        categoryId: categoryId,
      },
    }).then((response) => {
      expect(response.status).to.eq(409);
    });
  });

  it('should not create a subcategory if category does not exist', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/subcategories/create`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: 'Another Subcategory',
        categoryId: nonexistentCategoryId, // Non-existent category
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should get all subcategories successfully', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/subcategories`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should not get all subcategories if unauthorized', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/subcategories`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${falseAccessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('should update a subcategory successfully', () => {
    cy.request({
      method: 'PUT',
      url: `${apiUrl}/subcategories/${subcategoryId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: 'Updated Subcategory',
        categoryId: categoryId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq('Updated Subcategory');
    });
  });

  it('should not update a subcategory that does not exist', () => {
    cy.request({
      method: 'PUT',
      url: `${apiUrl}/subcategories/${nonexistentSubcategoryId}`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: 'Nonexistent Update',
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should delete a subcategory successfully', () => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/subcategories/${subcategoryId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('should not delete a subcategory that does not exist', () => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/subcategories/${nonexistentSubcategoryId}`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  after(() => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/categories/${categoryId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
