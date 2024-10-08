import { Role } from '../../src/role/entity/role.entity';

describe('Role API', () => {
  const apiUrl = 'https://marketplace-backend-production-d4eb.up.railway.app';

  let authToken = '';
  let falseAuthToken = '223e4&67-e8b9-1d23-b457-421124170881';

  const mockAdmin = {
    email: 'admin@example.com',
    password: 'Password123!'
  }

  before(() => {
    cy.request('POST', `${apiUrl}/auth/login`, mockAdmin).then((response) => {
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

  it('should not allow access with false JWT', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/roles`,
      headers: {
        Authorization: `Bearer ${falseAuthToken}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
