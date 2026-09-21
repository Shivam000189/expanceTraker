import { SMSDetector } from "./dashboard/SMSDetector";

export default function SmartSmsDetector({ onDetected, ...props }) {
  return <SMSDetector onDetect={onDetected} {...props} />;
}
