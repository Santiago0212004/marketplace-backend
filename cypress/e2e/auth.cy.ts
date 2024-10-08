describe('Auth API E2E Tests', () => {
  const apiUrl = 'https://marketplace-backend-production-d4eb.up.railway.app';
  let accessToken = '';
  let userId = '';
  let token = '';

  const mockUser = {
    email: 'tester@example.com',
    password: 'Password123!',
    fullName: 'Tester',
    address: '123 Main St',
    roleName: 'buyer'
  }

  it('should register a new user successfully', () => {
    cy.request('POST', `${apiUrl}/auth/register`, mockUser).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('access_token');
      accessToken = response.body.access_token;

      cy.request({
        method: 'GET',
        url: `${apiUrl}/users/email/${mockUser.email}`,
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
      email: mockUser.email,
      password: mockUser.password,
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
        email: mockUser.email,
        password: 'wrong_password',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401); // Unauthorized
    });
  });

  it('admin user should successfully login', () => {
    cy.request('POST', `${apiUrl}/auth/login`, {
      email: 'admin@example.com',
      password: 'Password123!',
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('access_token');
      token = response.body.access_token;
    });
  });

  after (() => {
    if (userId && token) {
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/users/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
      });
    }
  });

});
