import React from 'react';

const InvoiceTemplate = React.forwardRef(({ invoice, businessProfile }, ref) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const calculateGSTBreakup = () => {
        const breakup = {
            cgst: 0,
            sgst: 0,
            igst: 0
        };

        invoice.lineItems?.forEach(item => {
            const itemTotal = item.quantity * item.unitPrice;
            const taxAmount = (itemTotal * item.taxRate) / 100;

            if (item.taxType === 'CGST+SGST') {
                breakup.cgst += taxAmount / 2;
                breakup.sgst += taxAmount / 2;
            } else if (item.taxType === 'IGST') {
                breakup.igst += taxAmount;
            }
        });

        return breakup;
    };

    const gstBreakup = calculateGSTBreakup();

    return (
        <div ref={ref} style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            backgroundColor: 'white',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            color: '#000'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '30px', borderBottom: '3px solid #4F46E5', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#4F46E5', margin: '0 0 10px 0' }}>
                            {businessProfile?.businessName || 'Your Business'}
                        </h1>
                        <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                            {businessProfile?.address && <div>{businessProfile.address}</div>}
                            {businessProfile?.city && businessProfile?.state && businessProfile?.pincode && (
                                <div>{businessProfile.city}, {businessProfile.state} - {businessProfile.pincode}</div>
                            )}
                            {businessProfile?.email && <div>Email: {businessProfile.email}</div>}
                            {businessProfile?.phone && <div>Phone: {businessProfile.phone}</div>}
                            {businessProfile?.gstNumber && <div>GSTIN: {businessProfile.gstNumber}</div>}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', margin: '0 0 10px 0' }}>
                            INVOICE
                        </h2>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <strong>Invoice #:</strong> {invoice.invoiceNumber}
                            </div>
                            <div style={{ marginBottom: '5px' }}>
                                <strong>Date:</strong> {formatDate(invoice.invoiceDate)}
                            </div>
                            <div>
                                <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill To Section */}
            <div style={{ marginBottom: '30px' }}>
                <div style={{
                    backgroundColor: '#F8FAFC',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0'
                }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '0 0 10px 0' }}>
                        BILL TO:
                    </h3>
                    <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                            {invoice.clientId?.clientName || 'N/A'}
                        </div>
                        {invoice.clientId?.address && <div>{invoice.clientId.address}</div>}
                        {invoice.clientId?.city && invoice.clientId?.state && invoice.clientId?.pincode && (
                            <div>{invoice.clientId.city}, {invoice.clientId.state} - {invoice.clientId.pincode}</div>
                        )}
                        {invoice.clientId?.email && <div>Email: {invoice.clientId.email}</div>}
                        {invoice.clientId?.phone && <div>Phone: {invoice.clientId.phone}</div>}
                        {invoice.clientId?.gstNumber && <div>GSTIN: {invoice.clientId.gstNumber}</div>}
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '20px',
                fontSize: '11px'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#4F46E5', color: 'white' }}>
                        <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>Description</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold', width: '80px' }}>Qty</th>
                        <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold', width: '100px' }}>Rate</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold', width: '80px' }}>Tax</th>
                        <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold', width: '120px' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.lineItems?.map((item, index) => {
                        const itemTotal = item.quantity * item.unitPrice;
                        const taxAmount = (itemTotal * item.taxRate) / 100;
                        const totalWithTax = itemTotal + taxAmount;

                        return (
                            <tr key={index} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '12px 8px' }}>
                                    <div style={{ fontWeight: '500' }}>{item.description}</div>
                                    {item.hsnCode && (
                                        <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                                            HSN: {item.hsnCode}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '12px 8px', textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ padding: '12px 8px', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                    {item.taxRate}%<br />
                                    <span style={{ fontSize: '9px', color: '#666' }}>({item.taxType})</span>
                                </td>
                                <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500' }}>
                                    {formatCurrency(totalWithTax)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Totals Section */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
                <div style={{ width: '300px' }}>
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px' }}>
                            <span>Subtotal:</span>
                            <span>{formatCurrency(invoice.subtotal || 0)}</span>
                        </div>

                        {gstBreakup.cgst > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', color: '#666' }}>
                                <span>CGST:</span>
                                <span>{formatCurrency(gstBreakup.cgst)}</span>
                            </div>
                        )}

                        {gstBreakup.sgst > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', color: '#666' }}>
                                <span>SGST:</span>
                                <span>{formatCurrency(gstBreakup.sgst)}</span>
                            </div>
                        )}

                        {gstBreakup.igst > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', color: '#666' }}>
                                <span>IGST:</span>
                                <span>{formatCurrency(gstBreakup.igst)}</span>
                            </div>
                        )}

                        <div style={{
                            borderTop: '2px solid #4F46E5',
                            marginTop: '10px',
                            paddingTop: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>
                            <span>Total Amount:</span>
                            <span style={{ color: '#4F46E5' }}>{formatCurrency(invoice.totalAmount || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Terms & Notes */}
            {(invoice.paymentTerms || invoice.notes) && (
                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
                    {invoice.paymentTerms && (
                        <div style={{ marginBottom: '15px' }}>
                            <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#333', margin: '0 0 8px 0' }}>
                                Payment Terms:
                            </h4>
                            <p style={{ fontSize: '11px', color: '#666', margin: 0, lineHeight: '1.6' }}>
                                {invoice.paymentTerms}
                            </p>
                        </div>
                    )}

                    {invoice.notes && (
                        <div>
                            <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#333', margin: '0 0 8px 0' }}>
                                Notes:
                            </h4>
                            <p style={{ fontSize: '11px', color: '#666', margin: 0, lineHeight: '1.6' }}>
                                {invoice.notes}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div style={{
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '2px solid #4F46E5',
                textAlign: 'center',
                fontSize: '10px',
                color: '#666'
            }}>
                <p style={{ margin: 0 }}>Thank you for your business!</p>
                {businessProfile?.website && (
                    <p style={{ margin: '5px 0 0 0' }}>{businessProfile.website}</p>
                )}
            </div>
        </div>
    );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
