import React, { useState } from "react";

export const Contact = ({ showToast }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  return (
    <div className="static-page container">
      <h1 className="section-title">Contact Us</h1>
      <p className="section-desc">Got a question, issue, or just want to say hi? Drop us a message.</p>
      <form className="static-form" onSubmit={(e) => { e.preventDefault(); showToast("Message sent! We'll reply within 24h.", "success"); setForm({ name: "", email: "", message: "" }); }}>
        <div className="form-group"><label className="form-label">Name</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" rows={5} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} /></div>
        <button className="btn btn-primary btn-lg" type="submit">Send Message</button>
      </form>
    </div>
  );
};

export const FAQ = () => {
  const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout for an extra fee." },
    { q: "What's your return policy?", a: "We accept returns within 30 days of delivery as long as items are unworn and in original condition." },
    { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries worldwide. International shipping times vary by location." },
    { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking link. You can also check order status anytime in 'My Orders'." },
    { q: "What sizes are available?", a: "Most items come in sizes XS-2XL. Check the product page for specific size availability." },
  ];
  const [open, setOpen] = useState(null);
  return (
    <div className="static-page container">
      <h1 className="section-title">Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <div className="faq-item" key={i}>
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {f.q} <span>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="faq-a">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Returns = () => (
  <div className="static-page container">
    <h1 className="section-title">Returns Policy</h1>
    <div className="static-content">
      <p>We want you to love your CodeWithNK gear. If something isn't right, here's how returns work:</p>
      <ul>
        <li>Items can be returned within 30 days of delivery.</li>
        <li>Items must be unworn, unwashed, and in original packaging with tags attached.</li>
        <li>Refunds are processed within 5-7 business days after we receive your return.</li>
        <li>Sale items are final sale and not eligible for return unless defective.</li>
        <li>To start a return, contact us through the Contact page with your order ID.</li>
      </ul>
    </div>
  </div>
);
