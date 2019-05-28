const mock = {
  result: {},
};

export const answerMain = () => Promise.resolve({});

export const callRenderer = () => Promise.resolve(mock.result);
(callRenderer as any).setMock = (value: any) => (mock.result = value);
(callRenderer as any).removeMock = () => (mock.result = {});
