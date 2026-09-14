import { Title } from "../components/shared";
export default function Legal({ type }: { type: string }) {
  return (
    <div className="wrap reading">
      <Title
        eyebrow="Draft — client review required"
        title={`${type} notice`}
        description="This is a prototype notice, not an approved legal policy. Replace it with a policy reflecting the real business before publication."
      />
      {type === "Privacy" ? (
        <>
          <h2>Enquiries and subscriptions</h2>
          <p>
            Enquiries and newsletter subscriptions are stored in our database.
            We use enquiry details to respond, and send newsletters only after
            email confirmation. Transactional emails are delivered through our
            configured email provider.
          </p>
          <h2>Tracking and assets</h2>
          <p>
            Optional Google and Meta tracking is enabled only after you accept
            optional cookies. You can change your choice using Cookie
            preferences. With consent, enquiry conversion data may include
            hashed contact details sent to Meta. Photographs are served from
            local project assets.
          </p>
          <h2>Before publication</h2>
          <p>
            Confirm the business identity, contact details, actual processors,
            data uses, retention periods, rights process, and applicable
            jurisdictions. Review the final implementation alongside the policy.
          </p>
        </>
      ) : (
        <>
          <h2>Demonstration status</h2>
          <p>
            Aster Digital is a working identity. Services and packages are
            provisional, and concept projects are fictional examples. Nothing
            here establishes a commercial offer or service agreement.
          </p>
          <h2>Project agreements</h2>
          <p>
            A real engagement needs an agreed scope, commercial terms,
            responsibilities, intellectual property provisions, and support
            arrangements.
          </p>
          <h2>Content and third-party assets</h2>
          <p>
            Project copy and the placeholder identity were created for this
            prototype. Photography is licensed separately; attribution details
            are included in the project documentation.
          </p>
        </>
      )}
    </div>
  );
}
