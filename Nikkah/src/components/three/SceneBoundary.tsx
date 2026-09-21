"use client";
import { Component, type ReactNode } from "react";

/**
 * R3F rethrows scene errors in the parent render, which would replace the whole invitation with
 * Next's error page. The invitation must survive a dead GPU: swallow it and keep the CSS backdrop.
 */
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV === "development") console.warn("3D scene disabled:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
