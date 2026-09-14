import { Button } from "../components/shared";
export default function NotFound() {
  return (
    <div className="wrap not-found">
      <p className="eyebrow">404 / A LITTLE OFF THE PATH</p>
      <h1>
        Let’s find your
        <br />
        <em>way back.</em>
      </h1>
      <p>
        The page you’re looking for isn’t here. There’s plenty to explore from
        the beginning.
      </p>
      <Button to="/">Back to home</Button>
    </div>
  );
}
