import { useState, useEffect, useRef } from "react"

const EMPTY_INVOICE = {
  senderName: "",
  senderEmail: "",
  clientName: "",
  clientEmail: "",
  issueDate: "",
  dueDate: "",
  items: [],
}


export default function App() {

const [invoice, setInvoice] = useState(() => {
    const raw = localStorage.getItem("invoiceData")
    if (!raw) return EMPTY_INVOICE
    try {
      return JSON.parse(raw)
    } catch {
      return EMPTY_INVOICE
    }
  })


useEffect(() => {
    localStorage.setItem("invoiceData", JSON.stringify(invoice))
  }, [invoice])



function handleAddItem(e) {
  e.preventDefault()
  const form = e.target
  const item = {
    description: form.description.value,
    qty: form.qty.value,
    rate: form.rate.value,
  }
  setInvoice(prev => ({ ...prev, items: [...prev.items, item] }))
  form.reset()
} 

function handleDeleteItem(index) {
  setInvoice(prev => ({ ...prev, items: prev.items.filter((item, i) => i !== index) }))
}

function totalSum() {
  return invoice.items.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0),
    0
  )
}


function handleInput(e) {
  setInvoice(prev => ({ ...prev, [e.target.name]: e.target.value }))
}



  return (
    <div className="app">
      <header className="topbar">
        <h1>Invoice Builder</h1>

        <div className="topbar-actions">
          <button className="btn" type="button" >Save</button>
          <button className="btn btn-primary" type="button" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </header>

      <main className="grid">
        <section className="panel">
          <h2 style={{ marginTop: 0 }}>Editor</h2>
          <p style={{ opacity: 0.8 }}>
            Следом добавим поля: sender, client, invoice meta и line items.
          </p>
          
          <div>
            <input className="inputInvoice" name="senderName" value={invoice.senderName} onChange={handleInput} placeholder="Sender Name"></input>
            <input className="inputInvoice" name="senderEmail" value={invoice.senderEmail} onChange={handleInput} placeholder="Sender Email"></input>
            <input className="inputInvoice" name="clientName" value={invoice.clientName} onChange={handleInput} placeholder="Client Name"></input>
            <input className="inputInvoice" name="clientEmail" value={invoice.clientEmail} onChange={handleInput} placeholder="Client Email"></input>
            <input className="inputInvoice" name="issueDate" value={invoice.issueDate} onChange={handleInput} placeholder="Issue Date"></input>
            <input className="inputInvoice" name="dueDate" value={invoice.dueDate} onChange={handleInput} placeholder="Due Date"></input>
          </div>
          
            <span>Add Item</span>
            <form onSubmit={handleAddItem}>
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 110px", gap: 12, marginTop: 12 }}>
                  <input required name="description" className="inputInvoice" placeholder="Description"></input>
                  <input required name="qty" className="inputInvoice" placeholder="Qty" type="number" min="0"></input>
                  <input required name="rate" className="inputInvoice" placeholder="Rate" type="number" min="0"></input>
                </div>
                <button className="btn" type="submit" >Add</button>
              </div>
          </form>
          
        </section>

        <section className="preview-wrap">
          <div className="preview">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>INVOICE</div>
                <div style={{ opacity: 0.7, marginTop: 6 }}>#0001</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{invoice.senderName || "Sender Name"}</div>
                <div style={{ opacity: 0.7 }}>{invoice.senderEmail || "sender@email.com"}</div>
              </div>
            </div>

            <hr style={{ margin: "24px 0", border: 0, borderTop: "1px solid #eee" }} />

            <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, letterSpacing: 0.6, opacity: 0.6 }}>BILL TO</div>
                <div style={{ marginTop: 6, fontWeight: 700 }}>{invoice.clientName || "Client Name"}</div>
                <div style={{ opacity: 0.7 }}>{invoice.clientEmail || "client@email.com"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div><span style={{ opacity: 0.65 }}>Issue:</span> {invoice.issueDate || "2026-02-10"}</div>
                <div><span style={{ opacity: 0.65 }}>Due:</span> {invoice.dueDate || "2026-02-24"}</div>
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 110px 120px", gap: 12, fontWeight: 700 }}>
                <div>Description</div>
                <div style={{ textAlign: "right" }}>Qty</div>
                <div style={{ textAlign: "right" }}>Rate</div>
                <div style={{ textAlign: "right" }}>Amount</div>
              </div>

              <div>
                {invoice.items.map((item, index) => (
                  <div key={index} >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 110px 120px", gap: 12, marginTop: 12 } }>
                      <div><button type="button" onClick={() => handleDeleteItem(index)} style={{ border: 0, background: "none", cursor: "pointer", color: "#f00" }}>X</button> {item.description}</div>
                      <div style={{ textAlign: "right" }}>{item.qty}</div>
                      <div style={{ textAlign: "right" }}>{item.rate}</div>
                      <div style={{ textAlign: "right" }}>{item.qty * item.rate}</div>
                    </div>
                    
                  </div>
                ))}
              </div>


              <hr style={{ margin: "18px 0", border: 0, borderTop: "1px solid #eee" }} />

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: 320 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ opacity: 0.7 }}>Subtotal</span>
                    <strong>£{totalSum()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ opacity: 0.7 }}>Total</span>
                    <strong>£{totalSum()}</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  )
}
