import { Webhook } from "svix";
import User from "../modules/User.js";
import Stripe from "stripe";
import Purchase from "../routes/purchase.js";
import Course from "../modules/Course.js";

//API controller Function to Manage Clerk user with database

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    console.log(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;
    console.log(type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.create(userData);
        console.log(userData);

        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error.message);

    res.json({ success: false, message: error.message });
  }
};

//payment
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(
      "❌ Stripe webhook signature verification failed:",
      err.message
    );
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      try {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        console.log("✅ Payment succeeded for intent:", paymentIntentId);

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        const session = sessionList.data[0];

        if (!session || !session.metadata || !session.metadata.purchaseId) {
          console.error("❌ No valid session or purchaseId found in metadata.");
          return res.status(400).send("Missing session metadata.");
        }

        const purchaseId = session.metadata.purchaseId;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) throw new Error("Purchase not found");

        const userData = await User.findById(purchaseData.userId);
        if (!userData) throw new Error("User not found");

        const courseData = await Course.findById(purchaseData.courseId);
        if (!courseData) throw new Error("Course not found");

        // Avoid duplicate enrollment
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        await purchaseData.save();

        console.log("✅ Enrollment and purchase status updated.");
      } catch (err) {
        console.error(
          "❌ Error handling payment_intent.succeeded:",
          err.message
        );
        return res.status(500).send(`Internal Server Error: ${err.message}`);
      }

      break;
    }

    case "payment_intent.payment_failed": {
      try {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        console.log("❌ Payment failed for intent:", paymentIntentId);

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        const session = sessionList.data[0];

        if (!session || !session.metadata || !session.metadata.purchaseId) {
          console.error("❌ No valid session or purchaseId found in metadata.");
          return res.status(400).send("Missing session metadata.");
        }

        const purchaseId = session.metadata.purchaseId;
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) throw new Error("Purchase not found");

        purchaseData.status = "failed";
        await purchaseData.save();

        console.log("✅ Purchase marked as failed.");
      } catch (err) {
        console.error(
          "❌ Error handling payment_intent.payment_failed:",
          err.message
        );
        return res.status(500).send(`Internal Server Error: ${err.message}`);
      }

      break;
    }

    default:
      console.log(`🔔 Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  res.status(200).json({ received: true });
};
