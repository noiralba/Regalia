export default function VipBanner() {
  return (
    <section className="container my-5">
      <article className="vip-banner text-center text-white rounded-4 shadow p-5">
        <span className="badge text-bg-warning mb-3 px-3 py-2">Exklusivt</span>
        <h2 className="display-5 fw-bold mb-3">VIP</h2>
        <button className="btn btn-warning btn-lg px-5 fw-semibold">
          Se mer info om VIP
        </button>
      </article>
    </section>
  );
}
