import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LaunchWizard } from "./launch-wizard";

vi.mock("@/components/wallet-button", () => ({ WalletButton: () => <button>Connect wallet</button> }));

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:reference-preview");
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
  localStorage.clear();
});

afterEach(() => cleanup());

describe("LaunchWizard look references", () => {
  it("shows two preset looks and one upload tile", () => {
    render(<LaunchWizard launchReady={false}/>);

    expect(screen.getAllByRole("button", { name: /^Look / })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Upload your own reference image" })).toBeInTheDocument();
  });

  it("previews an uploaded reference image", () => {
    render(<LaunchWizard launchReady={false}/>);
    const file = new File(["image"], "reference.png", { type: "image/png" });

    fireEvent.change(screen.getByLabelText("Reference image file"), { target: { files: [file] } });

    expect(screen.getByAltText("Uploaded character reference")).toHaveAttribute("src", "blob:reference-preview");
    expect(screen.getByText("reference.png")).toBeInTheDocument();
  });
});
