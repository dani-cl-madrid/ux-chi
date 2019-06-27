describe('Spinner', () => {
  const selectors = [
    'spinner-md',
    'base-backdrop-spinner',
    'inverse-backdrop-spinner',
    'spinner-secondary',
    'spinner-xxl'
  ];

  const assertion = (el, value) => {
    cy.get(el).should('match', value);
  };

  before(() => {
    cy.visit('tests/custom-elements/spinner.html');
  });

  beforeEach(() => {
    selectors.forEach(s => {
      cy.get(`[data-cy=${s}]`, { timeout: 5000 })
        .should('have.class', 'hydrated')
        .children()
        .first()
        .as(s);
    });
  });

  it('Base spinner should be included inside the custom element', () => {
    assertion('@spinner-md', 'svg.a-spinner');
  });

  it('Base backdrop spinner should have appropriate class', () => {
    cy.get('@base-backdrop-spinner')
      .should('match', 'div.a-backdrop')
      .and('not.have.class', '-inverse');
  });

  it('Inverse backdrop spinner should have appropriate class', () => {
    cy.get('@inverse-backdrop-spinner')
      .should('match', 'div.a-backdrop')
      .and('have.class', '-inverse');
  });

  it('Colored spinner should have appropriate class', () => {
    assertion('@spinner-secondary', 'svg.a-spinner.-text--secondary');
  });

  it('Sized spinner should have appropriate class', () => {
    assertion('@spinner-xxl', 'svg.a-spinner.-xxl');
  });
});
