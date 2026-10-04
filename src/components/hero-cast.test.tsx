import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroCast } from "./hero-cast";

afterEach(() => cleanup());

describe("HeroCast", () => {
  it("uses the supplied dance video in the center and diving video on the right", () => {
    render(<HeroCast/>);

    expect(screen.getByTestId("hero-cast-left")).toHaveClass("rectangular");
    expect(screen.getByTestId("hero-cast-center")).toHaveClass("rectangular");
    expect(screen.getByTestId("hero-cast-right")).toHaveClass("rectangular");
    expect(screen.getByTestId("hero-dance-video")).toHaveAttribute("src", "/media/new-dances.mp4");
    expect(screen.getByTestId("hero-diving-video")).toHaveAttribute("src", "/media/rio-dod-diving.mp4");
  });

  it("plays on hover and resets when the pointer leaves", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    render(<HeroCast/>);
    const video = screen.getByTestId("hero-diving-video") as HTMLVideoElement;

    fireEvent.mouseEnter(video);
    expect(play).toHaveBeenCalled();
    fireEvent.mouseLeave(video);
    expect(pause).toHaveBeenCalled();
    expect(video.currentTime).toBe(0);
  });
});
