import SiteHeader from "./site-header";
import PipelineCanvas from "./pipeline-canvas";
import { MODS, STATE_LABEL } from "./work";

const CAL = "https://cal.com/contactlnp/30min";
const EMAIL = "aziz@builtbyaziz.com";

const CAPABILITIES = [
  "Workflow automation",
  "AI agents and RAG",
  "Systems integration",
  "Full-stack product",
  "Computer vision",
  "Infrastructure and deploy",
];

export default function Home() {
  const live = MODS.filter((m) => m.state === "live").length;

  return (
    <>
      <SiteHeader />

      <section className="hero" id="top">
        <PipelineCanvas />
        <div className="hero-inner col">
          <p className="kicker">Automation and AI infrastructure</p>
          <h1 className="name">
            Aziz
            <br />
            Eljurf
          </h1>
          <p className="tagline">
            I build the systems agencies resell under their own name.
            <span>
              Fixed scope, fixed price, working 9 to 6 Eastern. Your client never
              sees a handoff.
            </span>
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
        <div className="hero-fade" aria-hidden="true" />
      </section>

      <section className="band" aria-label="Capabilities">
        <div className="band-track">
          {[0, 1].map((dup) => (
            <div className="band-run" key={dup} aria-hidden={dup === 1}>
              {CAPABILITIES.map((c) => (
                <span key={c}>
                  {c}
                  <i aria-hidden="true">/</i>
                </span>
              ))}
            </div>
          ))}
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
              <div className="mod-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="mod-body">
                <p className={m.state === "live" ? "mod-top is-live" : "mod-top"}>
                  <span className="led-sm" aria-hidden="true" />
                  {STATE_LABEL[m.state]}
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
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="terms" id="terms">
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
                Scoped and priced up front, no hourly meter. Half on start, half
                on delivery. Overruns are mine, not yours.
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
          <h2>
            Got a build you don&rsquo;t have
            <br />
            capacity for?
          </h2>
          <p>
            Send the scope and I&rsquo;ll come back with a price and a delivery
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
