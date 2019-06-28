import styled from '#/styled';
import { css } from 'emotion';
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

const inputStyles = `
  cursor: text;
  padding: 1px 2px;
  &:focus {
    outline: none;
    box-shadow: -1px 2px 4px 0px rgba(0,0,0,0.5);
  }
`;

const KeyInputStyle = css`
  ${inputStyles}
  background-color: inherit;
  border: none;
  color: rgb(200, 0, 0);
  margin-left: 18px;
`;

const ValueInputStyle = css`
  ${inputStyles}
  background-color: inherit;
  border: none;
`;

interface State {
  styleRows: Array<{ key: string; value: string }>;
}

class StyleInspector extends React.Component<{}, State> {
  public state: State = {
    styleRows: [
      // {
      //   key: 'display',
      //   value: 'flex',
      // },
      // {
      //   key: 'background-color',
      //   value: 'pink',
      // },
    ],
  };

  private rowsRef: Array<{
    key: React.RefObject<HTMLInputElement>;
    value: React.RefObject<HTMLInputElement>;
  }> = [
    // {
    //   key: React.createRef(),
    //   value: React.createRef(),
    // },
    // {
    //   key: React.createRef(),
    //   value: React.createRef(),
    // },
  ];

  private onInputFocus = () => {
    setTimeout(() => {
      document.execCommand('selectAll');
    }, 0);
  };

  private getSpanRef = (type: 'key' | 'value', index: number) => {
    return (this.rowsRef[index][type].current as any).el.current;
  };

  private createRow = (index: number) => {
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
  };

  private instructions: Array<() => void> = [];

  private handleFirstBraceClick = () => {
    if (!this.state.styleRows.length) {
      this.createRow(0);
    } else {
      const keySpan = this.getSpanRef('key', 0);

      keySpan.focus();
    }
  };

  private onValueBlur = (index: number) => () => {
    if (index === this.state.styleRows.length - 1) {
      this.createRow(index + 1);
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
        {this.state.styleRows.map((rowData, i) => (
          <div key={i}>
            <ContentEditable
              className={KeyInputStyle}
              tagName="span"
              html={rowData.key}
              onChange={this.handleOnChange('key', i)}
              {...{
                tabIndex: 2 * i - 1,
                innerRef: this.rowsRef[i].key,
                onFocus: this.onInputFocus,
              } as any}
            />
            <span>{': '}</span>
            <ContentEditable
              className={ValueInputStyle}
              tagName="span"
              html={rowData.value}
              onChange={this.handleOnChange('value', i)}
              {...{
                tabIndex: 2 * i,
                innerRef: this.rowsRef[i].value,
                onFocus: this.onInputFocus,
                onBlur: this.onValueBlur(i),
              } as any}
            />
            <span>;</span>
          </div>
        ))}
        <div>{`}`}</div>
      </Container>
    );
  }
}

export default StyleInspector;
