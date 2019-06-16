import styled from '#/styled';
import produce from 'immer';
import * as React from 'react';

const Container = styled.div`
  padding: 8px;
`;

interface State {
  styleRows: Array<{ key: string; value: string }>;
}

class StyleInspector extends React.Component<{}, State> {
  public state: State = {
    styleRows: [
      {
        key: 'display',
        value: 'flex',
      },
    ],
  };
  private rowsRef: Array<{
    key: React.RefObject<HTMLInputElement>;
    value: React.RefObject<HTMLInputElement>;
  }> = [
    {
      key: React.createRef(),
      value: React.createRef(),
    },
  ];
  private instructions: Array<() => void> = [];

  private handleFirstBraceClick = () => {
    if (!this.state.styleRows.length) {
      const index = 0;
      this.rowsRef[index] = {
        key: React.createRef(),
        value: React.createRef(),
      };
      this.instructions.push(() => {
        this.rowsRef[index].key.current!.focus();
      });
      this.setState(
        produce((draft: State) => {
          draft.styleRows[index] = { key: '', value: '' };
        }),
      );
    }
  };

  public componentDidUpdate() {
    this.instructions.forEach(instruction => instruction());
    this.instructions = [];
  }

  public render() {
    return (
      <Container>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            border: '1px solid lightgrey',
            padding: 6,
            color: 'rgb(48, 57, 66)',
          }}
        >
          <div onClick={this.handleFirstBraceClick}>styled {`{`}</div>
          {this.state.styleRows.map((row, i) => (
            <div key={i}>
              <input
                style={{
                  fontFamily: 'monospace',
                  backgroundColor: 'inherit',
                  border: 'none',
                  width: row.key.length * 7,
                }}
                ref={this.rowsRef[i].key}
                value={row.key}
              />
              :
              <input
                style={{
                  fontFamily: 'monospace',
                  backgroundColor: 'inherit',
                  border: 'none',
                  width: row.key.length * 7,
                }}
                ref={this.rowsRef[i].value}
                value={row.value}
              />
            </div>
          ))}
          <div>{`}`}</div>
        </div>
      </Container>
    );
  }
}

export default StyleInspector;
