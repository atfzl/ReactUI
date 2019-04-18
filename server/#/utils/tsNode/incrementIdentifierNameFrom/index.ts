const incrementName = (name: string) => {
  const regArr = /_\$(\d*)$/.exec(name);

  if (!regArr) {
    return `${name}_$`;
  }

  const n = Number(regArr[1]);

  const index = regArr.index;

  return `${name.slice(0, index)}_$${n + 1}`;
};

const incrementIdentifierNameFrom = (declarationIdentifierNodes: string[]) => {
  const newNames: Record<string, string> = {};

  return (name: string) => {
    if (newNames[name]) {
      return newNames[name];
    }

    let expectedNewName = incrementName(name);

    while (declarationIdentifierNodes.includes(expectedNewName)) {
      expectedNewName = incrementName(expectedNewName);
    }

    newNames[name] = expectedNewName;

    return expectedNewName;
  };
};

export default incrementIdentifierNameFrom;
