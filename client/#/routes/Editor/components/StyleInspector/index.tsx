import { RootState } from '#/reducers';
import actions from '#/reducers/editor/actions';
import styled from '#/styled';
import { css } from 'emotion';
import produce from 'immer';
import * as React from 'react';
import ContentEditable from 'react-contenteditable';
import { connect } from 'react-redux';

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

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface Props extends StateProps, DispatchProps {}

interface State {
  styleRows: Array<{ key: string; value: string }>;
}

class StyleInspector extends React.PureComponent<Props, State> {
  public componentWillReceiveProps(props: Props) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < props.styles.length; ++i) {
      if (!this.rowsRef[i]) {
        this.rowsRef[i] = {
          key: React.createRef<HTMLSpanElement>(),
          value: React.createRef<HTMLSpanElement>(),
        };
      }
    }

    this.setState({ styleRows: props.styles }, this.syncStyles);
  }

  public state: State = {
    styleRows: [],
  };

  private rowsRef: Array<{
    key: React.RefObject<HTMLSpanElement>;
    value: React.RefObject<HTMLSpanElement>;
  }> = [];

  private syncStyles = () => {
    this.props.updatePreviewStyle({ styles: this.state.styleRows });
  };

  private onInputFocus = () => {
    setTimeout(() => {
      document.execCommand('selectAll');
    }, 0);
  };

  private getSpanRef = (type: 'key' | 'value', index: number) => {
    return this.rowsRef[index][type].current;
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
      this.syncStyles,
    );
  };

  private instructions: Array<() => void> = [];

  private handleFirstBraceClick = () => {
    if (!this.state.styleRows.length) {
      this.createRow(0);
    } else {
      const keySpan = this.getSpanRef('key', 0);

      if (keySpan) {
        keySpan.focus();
      }
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
      this.syncStyles,
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

const mapStateToProps = (state: RootState) => ({
  styles: state.editor.selectedStyle,
});

const mapDispatchToProps = {
  updatePreviewStyle: actions.updatePreviewStyle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyleInspector);
