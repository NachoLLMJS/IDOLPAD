import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeVideoShowcase } from "./home-video-showcase";

describe("HomeVideoShowcase", () => {
  it("uses the supplied diving video first and keeps the remaining reference motions", () => {
    render(<HomeVideoShowcase variant="rail" limit={8}/>);

    const videos = screen.getAllByTestId("public-motion-video");
    expect(videos).toHaveLength(8);
    expect(screen.getAllByText("BALLROOM")).toHaveLength(2);
    expect(screen.getByText("RIO DIVING")).toBeInTheDocument();
    expect(screen.getByText("FACE CAM")).toBeInTheDocument();
    expect(screen.getByText("STAGE")).toBeInTheDocument();
    expect(screen.getByText("DANCE")).toBeInTheDocument();
    expect(screen.getByText("HALLWAY WALK")).toBeInTheDocument();
    expect(screen.getByText("AIRPORT")).toBeInTheDocument();
    expect(videos[0]).toHaveAttribute("src", "/media/rio-dod-diving.mp4");
    expect(videos[5]).toHaveAttribute("src", "https://www.higgspad.com/media/motion/motion-01.mp4");
  });
});
