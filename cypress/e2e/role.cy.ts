import { Role } from '../../src/role/entity/role.entity';

describe('Role API', () => {
  const apiUrl = 'http://localhost:3000';

  let authToken = '';

  before(() => {
    cy.request('POST', `${apiUrl}/auth/login`, {
      email: 'admin@example.com',
      password: 'Password123!',
    }).then((response) => {
      authToken = response.body.access_token;
    });
  });

  it('should fetch all roles successfully', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/roles`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      response.body.forEach((role: Role) => {
        expect(role).to.have.property('id');
        expect(role).to.have.property('name');
      });
    });
  });

  it('should not allow access without JWT', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/roles`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
