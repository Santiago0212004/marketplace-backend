describe('User API E2E Tests', () => {
  const apiUrl = 'http://localhost:3000';
  let accessToken = '';
  let userId = '';
  let nonexistentUserId = '123e4567-e89b-12d3-a456-426614174000';
  let falseAccessToken = '321e4567-e8b9-1d23-a456-421664170040';
  const adminCredentials = { email: 'admin@example.com', password: 'Password123!' };
  const userCredentials = { email: 'newtester10@example.com', password: 'Password123!' };

  before(() => {
    cy.request('POST', `${apiUrl}/auth/login`, adminCredentials)
      .then((response) => {
        accessToken = response.body.access_token;
      });
  });

  it('should create a user successfully and get the ID via email', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/auth/register`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        fullName: 'Test User',
        email: userCredentials.email,
        password: userCredentials.password,
        address: '123 Test Street',
        roleName: 'buyer',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      cy.request({
        method: 'GET',
        url: `${apiUrl}/users/email/${userCredentials.email}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((userResponse) => {
        expect(userResponse.status).to.eq(200);
        userId = userResponse.body.id;
        expect(userId).to.exist;
      });
    });
  });

  it('should not create a user with an existing email', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/auth/register`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        fullName: 'Duplicate User',
        email: userCredentials.email,
        password: userCredentials.password,
        address: '456 Another Street',
        roleName: 'buyer',
      },
    }).then((response) => {
      expect(response.status).to.eq(409);
      expect(response.body.message).to.include('Email already exists');
    });
  });

  it('should retrieve a user by ID successfully', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/users/id/${userId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.email).to.eq(userCredentials.email);
    });
  });

  it('should not retrieve a non-existent user', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/users/${nonexistentUserId}`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('should not retrieve a user without authorization', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/users/${userId}`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${falseAccessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('should update a user successfully', () => {
    cy.request({
      method: 'PUT',
      url: `${apiUrl}/users/${userId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        fullName: 'Updated Test User',
      },
    }).then((updateResponse) => {
      expect(updateResponse.status).to.eq(200);
      expect(updateResponse.body.fullName).to.eq('Updated Test User');
    });
  });

  it('should not update a non-existent user', () => {
    cy.request({
      method: 'PUT',
      url: `${apiUrl}/users/${nonexistentUserId}`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        fullName: 'Non-Existent User',
      },
    }).then((updateResponse) => {
      expect(updateResponse.status).to.eq(404);
      expect(updateResponse.body.message).to.include('User with id');
    });
  });

  it('should not update a user without authorization', () => {
    cy.request({
      method: 'PUT',
      url: `${apiUrl}/users/${userId}`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${falseAccessToken}`,
      },
      body: {
        fullName: 'Unauthorized Update',
      },
    }).then((updateResponse) => {
      expect(updateResponse.status).to.eq(401);
    });
  });

  it('should not delete a user without authorization', () => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/users/${userId}/`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${falseAccessToken}`,
      },
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(401);
    });
  });

  it('should delete a user successfully', () => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/users/${userId}/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200);
      expect(deleteResponse.body.message).to.eq('User deleted successfully');
    });
  });

  it('should not delete a non-existent user', () => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/users/${nonexistentUserId}/`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(404);
      expect(deleteResponse.body.message).to.include('User with id');
    });
  });

  it('should not retrieve all users if not authorized', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/users`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${falseAccessToken}`,
      },
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(401);
    });
  });

  it('should retrieve all users', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/users/`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200);
    });
  });

});
