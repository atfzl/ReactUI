import getNewIdentifierNameCreator from '.';

it('not already appended with $', () => {
  const fileIdentifiers = ['styled', 'React', 'Button'];

  const getNewIdentifierName = getNewIdentifierNameCreator(fileIdentifiers);

  expect(getNewIdentifierName('styled')).toMatch('styled_$');
});

it('already appended with $ available in file', () => {
  const fileIdentifiers = ['styled', 'React', 'Button', 'styled_$'];

  const getNewIdentifierName = getNewIdentifierNameCreator(fileIdentifiers);

  expect(getNewIdentifierName('styled')).toMatch('styled_$1');
});

it('identifier already appended with $', () => {
  const fileIdentifiers = ['styled', 'React', 'Button', 'styled_$1'];

  const getNewIdentifierName = getNewIdentifierNameCreator(fileIdentifiers);

  expect(getNewIdentifierName('styled_$1')).toMatch('styled_$2');
});

it('with gaps', () => {
  const fileIdentifiers = [
    'styled',
    'React',
    'Button',
    'styled_$2',
    'styled_$10',
  ];

  const getNewIdentifierName = getNewIdentifierNameCreator(fileIdentifiers);

  expect(getNewIdentifierName('styled_$')).toMatch('styled_$1');
});

it('multiple increment needed', () => {
  const fileIdentifiers = [
    'styled_$',
    'React',
    'Button',
    'styled_$1',
    'styled_$2',
  ];

  const getNewIdentifierName = getNewIdentifierNameCreator(fileIdentifiers);

  expect(getNewIdentifierName('styled_$')).toMatch('styled_$3');
});
