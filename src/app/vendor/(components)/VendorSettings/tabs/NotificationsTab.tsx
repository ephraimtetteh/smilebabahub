"use client";

import { useState } from "react";
import { SectionCard, Toggle, SaveButton } from "../(component)/Ui";

type NotifState = {
  newOrder: boolean;
  orderStatus: boolean;
  newReview: boolean;
  lowStock: boolean;
  promotionApproved: boolean;
  payoutSent: boolean;
  newMessage: boolean;
  weeklyReport: boolean;
  marketingTips: boolean;
  smsNewOrder: boolean;
  smsPayment: boolean;
  whatsappOrder: boolean;
  emailDigest: boolean;
};

const DEFAULT_STATE: NotifState = {
  newOrder: true,
  orderStatus: true,
  newReview: true,
  lowStock: true,
  promotionApproved: true,
  payoutSent: true,
  newMessage: true,
  weeklyReport: false,
  marketingTips: false,
  smsNewOrder: true,
  smsPayment: true,
  whatsappOrder: false,
  emailDigest: true,
};

export default function NotificationsTab() {
  const [notifs, setNotifs] = useState<NotifState>(DEFAULT_STATE);
  const toggle = (k: keyof NotifState) =>
    setNotifs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div>
      <SectionCard title="Order Notifications">
        <Toggle
          checked={notifs.newOrder}
          onChange={() => toggle("newOrder")}
          label="New order placed"
          description="Get notified every time a customer places an order"
        />
        <Toggle
          checked={notifs.orderStatus}
          onChange={() => toggle("orderStatus")}
          label="Order status updates"
          description="Cancellations, returns, and disputes"
        />
      </SectionCard>

      <SectionCard title="Store Notifications">
        <Toggle
          checked={notifs.newReview}
          onChange={() => toggle("newReview")}
          label="New review received"
          description="When a customer reviews your product or store"
        />
        <Toggle
          checked={notifs.lowStock}
          onChange={() => toggle("lowStock")}
          label="Low stock alert"
          description="When a product stock falls below 5 units"
        />
        <Toggle
          checked={notifs.newMessage}
          onChange={() => toggle("newMessage")}
          label="New customer message"
        />
      </SectionCard>

      <SectionCard title="Financial Notifications">
        <Toggle
          checked={notifs.payoutSent}
          onChange={() => toggle("payoutSent")}
          label="Payout processed"
          description="When Smilebaba sends your earnings"
        />
        <Toggle
          checked={notifs.promotionApproved}
          onChange={() => toggle("promotionApproved")}
          label="Promotion approved / rejected"
          description="Status updates on your submitted promo videos"
        />
      </SectionCard>

      <SectionCard
        title="SMS Notifications"
        description="Standard network rates apply"
      >
        <Toggle
          checked={notifs.smsNewOrder}
          onChange={() => toggle("smsNewOrder")}
          label="SMS: New orders"
        />
        <Toggle
          checked={notifs.smsPayment}
          onChange={() => toggle("smsPayment")}
          label="SMS: Payout confirmation"
        />
      </SectionCard>

      <SectionCard title="WhatsApp Notifications">
        <Toggle
          checked={notifs.whatsappOrder}
          onChange={() => toggle("whatsappOrder")}
          label="WhatsApp: Order alerts"
          description="Receive order summaries on WhatsApp"
        />
      </SectionCard>

      <SectionCard title="Marketing & Reports">
        <Toggle
          checked={notifs.weeklyReport}
          onChange={() => toggle("weeklyReport")}
          label="Weekly performance report"
          description="Sales, views, and conversion summary every Monday"
        />
        <Toggle
          checked={notifs.marketingTips}
          onChange={() => toggle("marketingTips")}
          label="Marketing tips & platform updates"
        />
        <Toggle
          checked={notifs.emailDigest}
          onChange={() => toggle("emailDigest")}
          label="Daily email digest"
        />
      </SectionCard>

      <SaveButton />
    </div>
  );
}
