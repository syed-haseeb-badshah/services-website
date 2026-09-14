import { Button, Title } from "../components/shared";
export default function Simple({ type }: { type: string }) {
  return (
    <div className="wrap">
      <Title
        eyebrow={
          type === "careers" ? "Work with us" : "Client experience preview"
        }
        title={
          type === "careers"
            ? "Good work starts with good people."
            : "A little clarity, all in one place."
        }
        description={
          type === "careers"
            ? "There are no confirmed vacancies at this stage. The studio identity and team structure are still provisional."
            : "An illustrative view of how a future client space might organise a project. No login, billing, hosting access, or support system is connected."
        }
      />
      {type === "portal" && (
        <div className="directory">
          {[
            "Project scope & milestones",
            "Documents & handover",
            "Hosting & domain overview",
            "Invoices & support requests",
          ].map((x) => (
            <article className="proof" key={x}>
              <h2>{x}</h2>
              <p>
                Demonstration only. Real records and actions require a secure
                backend.
              </p>
            </article>
          ))}
        </div>
      )}
      <Button>Start a conversation</Button>
    </div>
  );
}
