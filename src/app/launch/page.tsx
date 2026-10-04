import { Header } from "@/components/shell";
import { LaunchWizard } from "@/components/launch-wizard";
import { isLaunchConfigured } from "@/lib/flap";

export default function LaunchPage(){return <div className="app-page"><Header/><main className="app-shell"><span className="eyebrow">CREATE · NAME · LAUNCH</span><LaunchWizard launchReady={isLaunchConfigured()}/></main></div>}
