import ChatRequestCard, { type FkRequest } from "@/components/tone-chat/ChatRequestCard";

/**
 * Dev harness for the ```fk-request``` chat card (same pattern as
 * /dev/pdf): renders the card states without needing an authed chat
 * session. Not linked anywhere; local-eyeball use only.
 */
export const metadata = { robots: { index: false, follow: false } };

const SAMPLE: FkRequest = {
  song_name: "Midnight in Harlem",
  artist_name: "Tedeschi Trucks Band",
  part: "lead guitar",
  description: "Derek's slide tone on the live Layla revisited version",
};

const MINIMAL: FkRequest = {
  song_name: "Lenny",
  artist_name: "Stevie Ray Vaughan",
  part: "lead guitar",
};

export default function ChatCardDevPage() {
  return (
    <div className="fk-preview">
      <div className="mx-auto max-w-xl p-8">
        <p className="mb-4 text-sm">fk-request card — full fields:</p>
        <ChatRequestCard request={SAMPLE} />
        <p className="mb-4 mt-8 text-sm">fk-request card — minimal (defaults):</p>
        <ChatRequestCard request={MINIMAL} />
      </div>
    </div>
  );
}
