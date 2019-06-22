import styled from '#/styled';
import produce from 'immer';
import * as React from 'react';
import ContentEditable from 'react-contenteditable';

const Container = styled.div`
  font-family: Menlo, monospace;
  font-size: 11px;
  border: 1px solid lightgrey;
  padding: 6px;
  color: rgb(48, 57, 66);
  background-color: white;
`;

const KeyInput = styled(ContentEditable)`
  background-color: inherit;
  border: none;
  color: rgb(200, 0, 0);
  margin-left: 18px;
`;

const ValueInput = styled(ContentEditable)`
  background-color: inherit;
  border: none;
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

  private getSpanRef = (type: 'key' | 'value', index: number) => {
    return (this.rowsRef[index][type].current as any).el.current;
  };

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
    } else {
      const keySpan = this.getSpanRef('key', 0);

      keySpan.focus();
    }
  };

  private handleOnChange = (type: 'key' | 'value', index: number) => (
    evt: any,
  ) => {
    const str = evt.target.value;

    this.setState(
      produce((draft: State) => {
        draft.styleRows[index][type] = str;
      }),
    );
  };

  public componentDidUpdate() {
    this.instructions.forEach(instruction => instruction());
    this.instructions = [];
  }

  public render() {
    return (
      <Container>
        <div onClick={this.handleFirstBraceClick}>styled {`{`}</div>
        {this.state.styleRows.map((row, i) => (
          <div key={i}>
            <KeyInput
              tagName="span"
              html={row.key}
              onChange={this.handleOnChange('key', i)}
              {...{ ref: this.rowsRef[i].key } as any}
            />
            <span>{': '}</span>
            <ValueInput
              tagName="span"
              html={row.value}
              onChange={this.handleOnChange('value', i)}
              {...{ ref: this.rowsRef[i].value } as any}
            />
          </div>
        ))}
        <div>{`}`}</div>
      </Container>
    );
  }
}

export default StyleInspector;
