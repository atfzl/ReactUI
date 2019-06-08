import Gallery from '#/routes/Editor/components/Gallery';
import styled from '@emotion/styled';
import * as React from 'react';
import { Route } from 'react-router';

const Container = styled.div`
  background-color: ${props => props.theme.colors.background[100]};
  height: 100vh;
  overflow-y: auto;
  position: relative;
`;

interface State {
  containerRect?: ClientRect;
}

class RightPanel extends React.PureComponent<{}, State> {
  public state: State = {};

  private containerRef = React.createRef<HTMLDivElement>();
  private resizeObserver: any;

  public componentDidMount() {
    this.resizeObserver = new (window as any).ResizeObserver((entries: any) => {
      for (const entry of entries) {
        this.setState({ containerRect: entry.contentRect });
      }
    });

    this.resizeObserver.observe(this.containerRef.current);
  }

  public componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  public render() {
    return (
      <Container ref={this.containerRef}>
        {this.state.containerRect && (
          <>
            <Route
              exact
              path="/"
              render={() => <Gallery width={this.state.containerRect!.width} />}
            />
          </>
        )}
      </Container>
    );
  }
}

export default RightPanel;
