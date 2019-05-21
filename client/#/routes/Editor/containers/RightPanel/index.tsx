import AutoScale from '#/components/AutoScale';
import Isolate from '#/components/Isolate';
import { RootState } from '#/reducers';
import actions from '#/reducers/gallery/actions';
import styled from '#/styled';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import { oc } from 'ts-optchain';

const Container = styled.div`
  background-color: ${props => props.theme.colors.background.dark};
  height: 100vh;
`;

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface Props extends StateProps, DispatchProps {}

interface State {
  containerRect?: ClientRect;
}

const ONE_SIDE_PADDING = 24;

class RightPanel extends React.PureComponent<Props, State> {
  public state: State = {};

  private containerRef = React.createRef<HTMLDivElement>();

  private onFrameReady = ({
    doc,
    element,
  }: {
    doc: Document;
    element: HTMLDivElement;
  }) => {
    this.props.setCanvasInternals({ doc, element });

    const resizeObserver = new (window as any).ResizeObserver(
      (entries: any) => {
        for (const entry of entries) {
          this.setState({ containerRect: entry.contentRect });
        }
      },
    );

    resizeObserver.observe(this.containerRef.current);
  };

  public render() {
    const { workspace, selectedComponent, setSelectedComponent } = this.props;

    return (
      <Container ref={this.containerRef}>
        <Isolate
          onReady={this.onFrameReady}
          style={{
            height: '100%',
            width: oc(this.state.containerRect).width(),
          }}
        >
          {workspace && this.state.containerRect && (
            <div style={{ paddingLeft: ONE_SIDE_PADDING }}>
              {workspace.components.map((component, i) => (
                <div style={{ marginTop: 20, marginBottom: 32 }} key={i}>
                  <div style={{ marginLeft: -8, fontWeight: 700 }}>
                    {component.title}
                  </div>
                  <div>
                    {component.instances.map((instance, j) => (
                      <div style={{ marginBottom: 8 }} key={j}>
                        <div style={{ textAlign: 'end', marginBottom: 4 }}>
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
                              border:
                                selectedComponent[0] === i &&
                                selectedComponent[1] === j
                                  ? '2px solid blue'
                                  : '1px solid rgba(0, 0, 0, 0.3)',
                              cursor: 'pointer',
                              userSelect: 'none',
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightPanel);
