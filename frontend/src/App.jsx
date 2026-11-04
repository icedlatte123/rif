import { Navigate, Route, Routes } from "react-router-dom";
import { PageGate } from "./components/PageGate.jsx";
import { SiteLayout } from "./components/SiteLayout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import ApplyPage from "./pages/ApplyPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";
import EnquiryPage from "./pages/EnquiryPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import IncubateesPage from "./pages/IncubateesPage.jsx";
import IncubateeProfilePage from "./pages/IncubateeProfilePage.jsx";
import IncubiteeFormPage from "./pages/IncubiteeFormPage.jsx";
import InternRegistrationPage from "./pages/InternRegistrationPage.jsx";
import LeadershipPage from "./pages/LeadershipPage.jsx";
import MediaCoveragePage from "./pages/MediaCoveragePage.jsx";
import MembershipFormPage from "./pages/MembershipFormPage.jsx";
import MembershipPage from "./pages/MembershipPage.jsx";
import MentorsPage from "./pages/MentorsPage.jsx";
import NewsEventsPage from "./pages/NewsEventsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import RefundPolicyPage from "./pages/RefundPolicyPage.jsx";
import RifServicesPage from "./pages/RifServicesPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import LeadershipMessagePage from "./pages/LeadershipMessagePage.jsx";
import TermsConditionsPage from "./pages/TermsConditionsPage.jsx";
import TestimonialsPage from "./pages/TestimonialsPage.jsx";
import VirtualStartupProfilePage from "./pages/VirtualStartupProfilePage.jsx";
import VirtualStartupsPage from "./pages/VirtualStartupsPage.jsx";

const gated = (pageKey, element) => <PageGate pageKey={pageKey}>{element}</PageGate>;

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route element={gated("home", <HomePage />)} path="/" />
        <Route element={gated("about", <AboutPage />)} path="/about" />
        <Route element={gated("leadership", <LeadershipPage />)} path="/leadership" />
        <Route element={gated("governorMessage", <LeadershipMessagePage messageKey="governorMessage" />)} path="/leadership/message-from-governor" />
        <Route element={gated("chiefMinisterMessage", <LeadershipMessagePage messageKey="chiefMinisterMessage" />)} path="/leadership/message-from-chief-minister" />
        <Route element={gated("viceChancellorMessage", <LeadershipMessagePage messageKey="viceChancellorMessage" />)} path="/leadership/message-from-vice-chancellor" />
        <Route element={gated("contact", <ContactPage />)} path="/contact" />
        <Route element={gated("team", <TeamPage sectionKey="coreTeam" />)} path="/team" />
        <Route element={gated("boardOfDirectors", <TeamPage sectionKey="boardOfDirectors" />)} path="/leadership/board-of-directors" />
        <Route element={gated("advisoryBoard", <TeamPage sectionKey="advisoryBoard" />)} path="/leadership/advisory-board" />
        <Route element={gated("boardOfDirectors", <TeamPage sectionKey="boardOfDirectors" />)} path="/team/board-of-directors" />
        <Route element={gated("advisoryBoard", <TeamPage sectionKey="advisoryBoard" />)} path="/team/advisory-board" />
        <Route element={gated("coreTeam", <TeamPage sectionKey="coreTeam" />)} path="/team/core-team" />
        <Route element={gated("interns", <TeamPage sectionKey="interns" />)} path="/team/interns" />
        <Route element={gated("incubatees", <IncubateesPage />)} path="/incubatees" />
        <Route element={gated("incubatees", <IncubateeProfilePage />)} path="/incubatees/:incubateeId" />
        <Route element={gated("virtualStartups", <VirtualStartupsPage />)} path="/virtual-startups" />
        <Route element={gated("virtualStartups", <VirtualStartupProfilePage />)} path="/virtual-startups/:startupId" />
        <Route element={gated("mentors", <MentorsPage />)} path="/mentors" />
        <Route element={gated("services", <ServicesPage />)} path="/services" />
        <Route element={gated("membershipPlans", <MembershipPage />)} path="/membership-plans" />
        <Route element={gated("rifServices", <RifServicesPage />)} path="/rif-services" />
        <Route element={gated("newsEvents", <NewsEventsPage />)} path="/news-events" />
        <Route element={gated("newsEvents", <NewsEventsPage />)} path="/news-events/:itemType/:itemId" />
        <Route element={gated("gallery", <GalleryPage />)} path="/gallery" />
        <Route element={gated("mediaCoverage", <MediaCoveragePage />)} path="/media-coverage" />
        <Route element={gated("documents", <DocumentsPage />)} path="/documents" />
        <Route element={gated("testimonials", <TestimonialsPage />)} path="/testimonials" />
        <Route element={gated("privacyPolicy", <PrivacyPolicyPage />)} path="/privacy-policy" />
        <Route element={gated("termsConditions", <TermsConditionsPage />)} path="/terms-and-conditions" />
        <Route element={gated("refundPolicy", <RefundPolicyPage />)} path="/refund-policy" />
        <Route element={gated("apply", <ApplyPage />)} path="/apply" />
        <Route element={gated("enquiry", <EnquiryPage />)} path="/enquiry" />
        <Route element={gated("membershipRegister", <MembershipFormPage />)} path="/membership-register" />
        <Route element={gated("incubateeRegister", <IncubiteeFormPage />)} path="/incubatee-register" />
        <Route element={gated("internRegistration", <InternRegistrationPage />)} path="/intern-registration" />
        <Route element={<Navigate replace to="/intern-registration" />} path="/intern-register" />
        <Route element={<Navigate replace to="/intern-registration" />} path="/interns-registration" />
        <Route element={<Navigate replace to="/intern-registration" />} path="/interns/register" />
        <Route element={<AdminDashboardPage />} path="/admin" />
        <Route element={<AdminDashboardPage teamMode />} path="/team-panel" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
}
