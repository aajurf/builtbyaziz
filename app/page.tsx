import StatusRail from "./status-rail";
import { MODS, STATE_LABEL } from "./work";

const CAL = "https://cal.com/contactlnp/30min";
const EMAIL = "aziz@builtbyaziz.com";

export default function Home() {
  const live = MODS.filter((m) => m.state === "live").length;

  return (
    <>
      <StatusRail />

      <section className="hero">
        <div className="col">
          <ul className="boot">
            <li>&gt; locating systems</li>
            <li>
              &gt; {MODS.length} found &middot; {live} running{" "}
              <span className="ok">ok</span>
            </li>
            <li>&gt; ready</li>
          </ul>

          <h1 className="name">
            Aziz
            <br />
            Eljurf
          </h1>

          <p className="tagline">
            I build automation and AI infrastructure that agencies resell under
            their own name. <em>US citizen, working US business hours, so your
            client never sees a handoff.</em>
          </p>

          <div className="actions">
            <a className="btn" href={CAL} target="_blank" rel="noopener noreferrer">
              Book a 20 minute call
            </a>
            <a className="btn btn-ghost" href="#work">
              See the work
            </a>
          </div>
        </div>
      </section>

      <section className="modules" id="work">
        <div className="col">
          <div className="sec-head">
            <h2>Systems</h2>
            <span>
              {MODS.length} built &middot; {live} in production
            </span>
          </div>

          {MODS.map((m, i) => (
            <article className="mod" key={m.title}>
              <p
                className={
                  m.state === "live" ? "mod-top is-live" : "mod-top"
                }
              >
                <span className="led-sm" aria-hidden="true" />
                {STATE_LABEL[m.state]}
                <span className="idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </p>

              <h3>{m.title}</h3>

              {m.body.map((para) => (
                <p key={para.slice(0, 20)}>{para}</p>
              ))}

              <div className="pipe" aria-label="System flow">
                {m.pipeline.map((step) => (
                  <span className="node" key={step}>
                    <b>{step}</b>
                    <i aria-hidden="true">&rarr;</i>
                  </span>
                ))}
              </div>

              <dl className="tel">
                <div className="tel-row">
                  <dt>Runtime</dt>
                  <dd className="stackline">{m.runtime.join("  ·  ")}</dd>
                </div>
                <div className="tel-row is-outcome">
                  <dt>Outcome</dt>
                  <dd>{m.outcome}</dd>
                </div>
                {m.scope ? (
                  <div className="tel-row">
                    <dt>Scope</dt>
                    <dd>{m.scope}</dd>
                  </div>
                ) : null}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="terms">
        <div className="col">
          <div className="sec-head">
            <h2>How it works</h2>
          </div>

          <div className="terms-grid">
            <div className="term">
              <h4>White label</h4>
              <p>
                I build under your name. I never contact your client, and you get
                a walkthrough recording you can forward as your own.
              </p>
            </div>
            <div className="term">
              <h4>Fixed price</h4>
              <p>
                Scoped up front, priced up front, no hourly meter. Half on start,
                half on delivery. Overruns are mine, not yours.
              </p>
            </div>
            <div className="term">
              <h4>Your hours</h4>
              <p>
                I work 9 to 6 Eastern. Questions get answered the same day, not
                the next morning your time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="close">
        <div className="col">
          <h2>Got a build you don&rsquo;t have capacity for?</h2>
          <p>
            Send me the scope and I&rsquo;ll come back with a price and a delivery
            date. If it isn&rsquo;t a fit I&rsquo;ll tell you that instead.
          </p>
          <div className="actions">
            <a className="btn" href={CAL} target="_blank" rel="noopener noreferrer">
              Book a 20 minute call
            </a>
            <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="col foot-inner">
          <span>Aziz Eljurf</span>
          <a href={`mailto:${EMAIL}`}>Email</a>
          <span className="push">Built by hand</span>
        </div>
      </footer>
    </>
  );
}
