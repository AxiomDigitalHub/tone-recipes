/** Skeleton for /browse while the results render. */
export default function BrowseLoading() {
  return (
    <div className="fk-browse" aria-hidden="true">
      <section className="fk-wrap fk-browse-head">
        <div className="fk-browse-headcopy">
          <div className="fk-skel" style={{ height: 58, width: 320, maxWidth: "100%" }} />
          <div className="fk-skel" style={{ height: 30, width: 460, maxWidth: "100%" }} />
        </div>
      </section>
      <section className="fk-wrap fk-browse-layout">
        <div className="fk-rail">
          <div className="fk-skel" style={{ height: 92 }} />
          <div className="fk-skel" style={{ height: 320 }} />
        </div>
        <div className="fk-browse-results">
          <div className="fk-card-grid fk-browse-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="fk-skel" style={{ aspectRatio: "1 / 1" }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
