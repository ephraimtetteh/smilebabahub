"use client";
// Vendor Settings → Notifications tab
// Loads preferences from user.notifications. Saves via PATCH /auth/notifications.

import { useState, useEffect, useRef } from "react";
import { SectionCard, Toggle, SaveButton } from "../(components)/UI";
import { useVendorSettings } from "@/src/hooks/useVendorSettings";




type NotifState = {
  newOrder: boolean;
  orderStatus: boolean;
  newReview: boolean;
  newMessage: boolean;
  payoutSent: boolean;
  promotionApproved: boolean;
  weeklyReport: boolean;
  marketingTips: boolean;
  smsNewOrder: boolean;
  smsPayment: boolean;
  whatsappOrder: boolean;
};

const DEFAULTS: NotifState = {
  newOrder: true,
  orderStatus: true,
  newReview: true,
  newMessage: true,
  payoutSent: true,
  promotionApproved: true,
  weeklyReport: false,
  marketingTips: false,
  smsNewOrder: true,
  smsPayment: true,
  whatsappOrder: false,
};

export default function NotificationsTab() {
  const { user, saving, saveNotifications } = useVendorSettings();
  const [notifs, setNotifs] = useState<NotifState>({
    ...DEFAULTS,
    ...(user?.notifications ?? {}),
  });
  const toggle = (k: keyof NotifState) =>
    setNotifs((p) => ({ ...p, [k]: !p[k] }));

  const seededRef = useRef(false);
  useEffect(() => {
    if (!user?.notifications) return;
    if (seededRef.current) return;
    seededRef.current = true;
    setNotifs({ ...DEFAULTS, ...user.notifications });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.updatedAt]);

  const handleSave = () => saveNotifications({ notifications: notifs });

  return (
    <div>
      <SectionCard title="Order notifications">
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
          description="Cancellations, returns and disputes"
        />
        <Toggle
          checked={notifs.newMessage}
          onChange={() => toggle("newMessage")}
          label="New customer message"
        />
      </SectionCard>

      <SectionCard title="Store & financial notifications">
        <Toggle
          checked={notifs.newReview}
          onChange={() => toggle("newReview")}
          label="New review received"
          description="When a customer reviews your product or store"
        />
        <Toggle
          checked={notifs.payoutSent}
          onChange={() => toggle("payoutSent")}
          label="Payout processed"
          description="When SmileBaba transfers your earnings"
        />
        <Toggle
          checked={notifs.promotionApproved}
          onChange={() => toggle("promotionApproved")}
          label="Promotion approved / rejected"
          description="Status updates on your submitted promo videos"
        />
      </SectionCard>

      <SectionCard
        title="SMS notifications"
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

      <SectionCard title="WhatsApp notifications">
        <Toggle
          checked={notifs.whatsappOrder}
          onChange={() => toggle("whatsappOrder")}
          label="WhatsApp: Order alerts"
          description="Receive order summaries on WhatsApp"
        />
      </SectionCard>

      <SectionCard title="Marketing & reports">
        <Toggle
          checked={notifs.weeklyReport}
          onChange={() => toggle("weeklyReport")}
          label="Weekly performance report"
          description="Sales, views and conversion summary every Monday"
        />
        <Toggle
          checked={notifs.marketingTips}
          onChange={() => toggle("marketingTips")}
          label="Marketing tips & platform updates"
        />
      </SectionCard>

      <SaveButton saving={saving === "notifications"} onClick={handleSave} />
    </div>
  );
}