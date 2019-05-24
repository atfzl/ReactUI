import AutoScale from '#/components/AutoScale';
import Isolate from '#/components/Isolate';
import { RootState } from '#/reducers';
import actions from '#/reducers/gallery/actions';
import styled from '#/styled';
import { Theme } from '#/styled/theme';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import { pipe } from 'rxjs';
import { oc } from 'ts-optchain';

const ONE_SIDE_PADDING = 24;

const Container = styled.div`
  background-color: ${props => props.theme.colors.background.dark};
  height: 100vh;
`;

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface Props extends StateProps, DispatchProps {
  theme: Theme;
}

interface State {
  containerRect?: ClientRect;
}

class RightPanel extends React.PureComponent<Props, State> {
  public state: State = {};

  private containerRef = React.createRef<HTMLDivElement>();
  private resizeObserver: any;

  private onFrameReady = ({
    doc,
    element,
  }: {
    doc: Document;
    element: HTMLDivElement;
  }) => {
    this.props.setCanvasInternals({ doc, element });

    this.resizeObserver = new (window as any).ResizeObserver((entries: any) => {
      for (const entry of entries) {
        this.setState({ containerRect: entry.contentRect });
      }
    });

    this.resizeObserver.observe(this.containerRef.current);
  };

  public componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  public render() {
    const {
      workspace,
      selectedComponent,
      setSelectedComponent,
      theme,
    } = this.props;

    return (
      <Container ref={this.containerRef}>
        <Isolate
          onReady={this.onFrameReady}
          style={{
            height: '100%',
            width: oc(this.state.containerRect).width(),
          }}
          wrapperStyle={{
            paddingLeft: ONE_SIDE_PADDING,
            paddingRight: ONE_SIDE_PADDING,
          }}
          injectCSS={
            "@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600&display=swap');"
          }
        >
          {workspace && this.state.containerRect && (
            <div>
              {workspace.components.map((component, i) => (
                <div style={{ marginTop: 20, marginBottom: 32 }} key={i}>
                  <div
                    style={{
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: 16,
                      marginLeft: -8,
                      fontWeight: 600,
                    }}
                  >
                    {component.title}
                  </div>
                  <div>
                    {component.instances.map((instance, j) => (
                      <div
                        style={{
                          marginBottom: 8,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                        key={j}
                      >
                        <div
                          style={{
                            fontFamily: 'IBM Plex Sans, sans-serif',
                            fontSize: 16,
                            marginBottom: 5,
                            alignSelf: 'flex-end',
                            borderBottom:
                              selectedComponent[0] === i &&
                              selectedComponent[1] === j
                                ? `2px solid ${theme.colors.primary}`
                                : '2px solid transparent',
                            cursor: 'pointer',
                          }}
                          onClick={() => setSelectedComponent([i, j])}
                        >
                          {instance.title}
                        </div>
                        <AutoScale
                          maxWidth={
                            this.state.containerRect!.width -
                            ONE_SIDE_PADDING * 2
                          }
                        >
                          <div
                            style={{
                              display: 'inline-block',
                              border: '1px solid rgba(0, 0, 0, 0.3)',
                              userSelect: 'none',
                              cursor: 'pointer',
                            }}
                            onClick={() => setSelectedComponent([i, j])}
                            dangerouslySetInnerHTML={{
                              __html: ReactDOMServer.renderToStaticMarkup(
                                instance.element,
                              ),
                            }}
                          />
                        </AutoScale>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Isolate>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  workspace: state.gallery.workspace,
  selectedComponent: state.gallery.selectedComponent,
});

const mapDispatchToProps = {
  setCanvasInternals: actions.setCanvasInternals,
  setSelectedComponent: actions.setSelectedComponent,
};

export default pipe(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withTheme,
)(RightPanel);
