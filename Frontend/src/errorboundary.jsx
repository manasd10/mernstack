import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log to console (or send to an error tracking service)
    console.error("Captured error:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
          <h2>Something went wrong</h2>
          <p>
            The app encountered an error. Open developer console for details.
          </p>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error)}
            {this.state.info ? `\n\n${JSON.stringify(this.state.info)}` : ""}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
