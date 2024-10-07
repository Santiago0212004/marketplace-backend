describe('Auth API E2E Tests', () => {
  const apiUrl = 'http://localhost:3000';
  let accessToken = '';
  let userId = '';
  let adminToken = ''; // Token para el administrador

  it('should register a new user successfully', () => {
    cy.request('POST', `${apiUrl}/auth/register`, {
      email: 'ggg@example.com',
      password: 'Password123!',
      fullName: 'Tester',
      address: '123 Main St',
      roleName: 'buyer',
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('access_token');
      accessToken = response.body.access_token;

      cy.request({
        method: 'GET',
        url: `${apiUrl}/users/email/ggg@example.com`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((userResponse) => {
        expect(userResponse.status).to.eq(200);
        userId = userResponse.body.id;
      });
    });
  });

  it('should login with valid credentials', () => {
    cy.request('POST', `${apiUrl}/auth/login`, {
      email: 'test@example.com',
      password: 'Password123!',
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('access_token');
    });
  });

  it('should not login with invalid credentials', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/auth/login`,
      body: {
        email: 'test@example.com',
        password: 'wrong_password',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401); // Unauthorized
    });
  });

  it('should login as admin to get access token', () => {
    cy.request('POST', `${apiUrl}/auth/login`, {
      email: 'admin@example.com',
      password: 'Password123!',
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('access_token');
      adminToken = response.body.access_token;
    });
  });

  it('should delete the user', () => {
    if (userId && adminToken) {
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/users/${userId}`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
      });
    }
  });
});
