import SiteHeader from "./site-header";
import PipelineCanvas from "./pipeline-canvas";
import Systems from "./systems";
import Trace from "./trace";
import TraceField from "./trace-field";
import TypeHead from "./type-head";
import { CAPS, AREA_LABEL, EXPLORING } from "./work";

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
  const areas = Object.keys(AREA_LABEL).length;

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
              Fixed scope, fixed price, and I work your hours in your time zone.
              Your client never sees a handoff.
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
          <TypeHead
            idx="S01"
            text="Capabilities"
            meta={`${areas} areas · ${CAPS.length} capabilities`}
          />
          <p className="sec-intro">
            What I build, and what you end up with. Most of it has shipped
            already — where it has, the tile names the build it came out of.
          </p>
          <Systems />
        </div>
      </section>

      <section className="modules tracewrap" id="trace">
        <TraceField />
        <div className="col">
          <TypeHead
            idx="S02"
            text="Start where you are"
            meta="Pick a situation · watch the build"
          />
          <p className="sec-intro">
            Every one of these is a pipeline I have actually built and run.
            Pick the one that sounds like your week.
          </p>
          <Trace />
        </div>
      </section>

      <section className="explore" id="explore">
        <div className="col">
          <TypeHead
            idx="S03"
            text="Exploring"
            meta="Where the next builds are going"
          />
          <ul className="explore-grid">
            {EXPLORING.map((e, i) => (
              <li className="explore-item" key={e.label}>
                <span className="explore-idx" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{e.label}</h3>
                <p>{e.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="terms" id="terms">
        <div className="col">
          <TypeHead idx="S04" text="How it works" meta="Engagement terms" />
          <div className="terms-grid">
            <div className="term bracket">
              <h4><em>01</em>White label</h4>
              <p>
                I build under your name. I never contact your client, and you get
                a walkthrough recording you can forward as your own.
              </p>
            </div>
            <div className="term bracket">
              <h4><em>02</em>Fixed price</h4>
              <p>
                Scoped and priced up front, no hourly meter. Half on start, half
                on delivery. Overruns are mine, not yours.
              </p>
            </div>
            <div className="term bracket">
              <h4><em>03</em>Your hours</h4>
              <p>
                Pacific, Mountain, Central, Eastern or further out — I run my day
                on your clock. Questions get answered the same day, not the next
                morning your time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="close">
        <div className="col">
          <div className="close-panel bracket">
            <p className="close-tag">Currently taking work</p>
            <h2>
              Got a build you don&rsquo;t have
              <br />
              capacity for?
            </h2>
            <p>
              Send the scope and I&rsquo;ll come back with a price and a
              delivery date. If it isn&rsquo;t a fit I&rsquo;ll tell you that
              instead.
            </p>
            <div className="actions">
              <a
                className="btn"
                href={CAL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a 20 minute call
              </a>
              <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>
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
