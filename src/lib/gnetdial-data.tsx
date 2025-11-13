

import { SearchVisibilityIcon, GuaranteedLeadsIcon, OnlineCatalogueIcon, PaymentSolutionsIcon, SmartLeadSystemIcon, CompetitorAnalysisIcon, PremiumCustomerSupportIcon, TrustStampIcon, VerifiedSealIcon, GnetdialRatingCertificateIcon, BusinessWebsiteIcon, WebsiteBannerIcon, MobileBannerIcon } from '@/components/icons/AdvertiseIcons';

export const plans = [
    {
        name: 'Standard',
        subtitle: '1 Year Plan',
        price: '78',
        originalPrice: '98',
        discount: 25,
        priceSubtitle: 'Billed as ₹28,470/year',
        buttonText: 'Buy Now',
        duration: '1 Year Plan'
    },
    {
        name: 'Standard',
        subtitle: '2 Year Plan',
        price: '59',
        originalPrice: '98',
        discount: 40,
        priceSubtitle: 'Billed as ₹43,070/year',
        buttonText: 'Buy Now',
        duration: '2 Year Plan'
    },
    {
        name: 'Standard',
        subtitle: '3 Year Plan',
        price: '52',
        originalPrice: '98',
        discount: 50,
        priceSubtitle: 'Billed as ₹56,940/year',
        buttonText: 'Buy Now',
        highlight: true,
        duration: '3 Year Plan'
    },
    {
        name: 'Growth',
        subtitle: 'Pricing for Offer Banners',
        buttonText: 'Explore',
        nameIcon: 'growth'
    }
];

export const planFeatures = [
    { name: 'Search Visibility', info: true, values: ['1x', '1x', '1x', 'Guaranteed Top Visibility'] },
    { name: 'Guaranteed Leads', info: true, values: [true, true, true, true] },
    { name: 'Online Catalogue', info: true, values: [true, true, true, true] },
    { name: 'Payment Solutions', info: true, values: [true, true, true, true] },
    { name: 'Smart Lead System', info: true, values: [true, true, true, true] },
    { name: 'Competitor Analysis', info: true, values: [true, true, true, true] },
    { name: 'Premium Customer Support', info: true, values: [true, true, true, true] },
    { name: 'Trust Stamp', info: true, values: [false, false, true, true] },
    { name: 'Verified Seal', info: true, values: [false, false, true, true] }
];

export const features = [
    { 
        icon: <PremiumCustomerSupportIcon />,
        title: 'Premium Listing',
        description: 'Get higher visibility and more main listings.',
    },
    { 
        icon: <VerifiedSealIcon />,
        title: 'Verified Seal',
        description: 'Verify your business listing on Gnetdial and improve your credibility.',
        verified: true
    },
    { 
        icon: <OnlineCatalogueIcon />,
        title: 'Online Catalogue',
        description: 'Showcase your product and services offerings for potential customers.',
    },
    { 
        icon: <TrustStampIcon />,
        title: 'Trust Stamp',
        description: 'Be recognised as a Gnetdial Trust Stamp partner for your business.',
    },
    { 
        icon: <PaymentSolutionsIcon />,
        title: 'Payment Solutions',
        description: 'Send and receive money from suppliers and customers.',
    },
    { 
        icon: <MobileBannerIcon />,
        title: 'Mobile Banner',
        description: 'Promote your business on competitor listings by targeting high-intent users.',
    },
    { 
        icon: <SmartLeadSystemIcon />,
        title: 'Smart Lead Management System',
        description: 'View and track all your leads at one place.',
    },
    { 
        icon: <WebsiteBannerIcon />,
        title: 'Website Banner',
        description: 'Promote your business on competitor listings by targeting high-intent users.',
    },
    { 
        icon: <CompetitorAnalysisIcon />,
        title: 'Competitor Analysis',
        description: 'Analyse what your competitors are partnering on Gnetdial.',
    },
    { 
        icon: <BusinessWebsiteIcon />,
        title: 'Business Website',
        description: 'Get a professional-looking website with your name and branding.',
    },
    { 
        icon: <PremiumCustomerSupportIcon />,
        title: 'Premium Customer Support',
        description: 'Get a never-ending experience with priority assistance.',
    },
    { 
        icon: <GnetdialRatingCertificateIcon />,
        title: 'Gnetdial Rating Certificate',
        description: 'Boost trust by displaying positive ratings with a time-bound certificate.',
    },
];

export const competitors = [
    { name: 'SM Computer', location: 'Pratap Nagar, Nagpur', logo: 'https://picsum.photos/seed/sm-computer-logo/100/50' },
    { name: 'Mloom Digital', location: 'Sitabuldi, Nagpur', logo: 'https://picsum.photos/seed/mloom-digital-logo/100/50' },
    { name: 'Elrika Computer', location: 'Dharampeth, Nagpur', logo: 'https://picsum.photos/seed/elrika-logo/100/50' },
    { name: 'Another Competitor', location: 'Someplace, Nagpur', logo: 'https://picsum.photos/seed/competitor-4/100/50' },
];

export const successStories = [
    { name: 'Rajesh Chhabria', company: 'Chhabria and Sons', image: 'https://picsum.photos/seed/rajesh-chhabria-img/400/225', bgColor: 'bg-pink-50' },
    { name: 'Varshini', company: 'V2 Makeover', image: 'https://picsum.photos/seed/varshini-img/400/225', bgColor: 'bg-blue-50' },
    { name: 'Gourab Neogi', company: 'Tolly Academy', image: 'https://picsum.photos/seed/gourab-neogi-img/400/225', bgColor: 'bg-green-50' },
];

export const faqItems = [
    {
      question: "What benefits will I get from a paid listing on Gnetdial?",
      answer: "A paid listing on Gnetdial offers several advantages, including higher visibility in search results, access to more potential customers, and premium features like an online catalogue, payment solutions, and competitor analysis. This helps you stand out and grow your business more effectively."
    },
    {
      question: "How can I choose the best paid plan for me?",
      answer: "Choosing the best plan depends on your business needs and budget. The Standard plans offer foundational features, with longer-term plans providing better value. The Growth plan offers the most features for maximum visibility and lead generation. We recommend assessing your goals and comparing the feature sets."
    },
    {
      question: "How does our ad work?",
      answer: "Our ads work by placing your business listing in prominent positions when users search for relevant keywords. We use targeted advertising to reach high-intent users, including displaying your banner on competitor listings, to drive more traffic and leads to your business."
    },
    {
      question: "What are the advantages of upgrading, and how do the different packages differ?",
      answer: "Upgrading your package unlocks more powerful features. For example, moving from a 1-year to a 3-year Standard plan grants you the Trust Stamp and Verified Seal, which build credibility. The Growth plan provides the highest level of search visibility. Each package is designed to offer increasing levels of exposure and business tools."
    },
    {
      question: "What payment methods are available?",
      answer: "We accept a variety of payment methods, including credit cards, debit cards, net banking, and popular UPI platforms. Our payment solutions are secure and easy to use."
    },
    {
      question: "Can I change my package later?",
      answer: "Yes, you can upgrade your package at any time to access more features and benefits. Please contact our customer support for assistance with changing your plan."
    },
    {
      question: "Can I receive leads only from specific areas?",
      answer: "Yes, our platform allows for geo-targeting, so you can specify the areas from which you want to receive leads, ensuring you connect with local customers relevant to your business."
    },
    {
      question: "Can I stop the campaign and start it later?",
      answer: "Our plans are based on subscription periods. While you can manage your ad's visibility, stopping and restarting a campaign is subject to the terms of your chosen plan. Please consult with our support team for specific options."
    },
    {
      question: "Will the monthly payment change during my contract?",
      answer: "The payment for your chosen plan is fixed for the duration of the contract. You will be billed at the agreed-upon rate without any changes during your subscription period."
    },
    {
      question: "What is the minimum payment plans available?",
      answer: "Our minimum payment plan is the 1-year Standard plan. We offer longer-term plans at a discounted rate for better value."
    },
    {
      question: "What is the minimum tenure for plans available on Gnetdial?",
      answer: "The minimum tenure for a paid listing on Gnetdial is one year. We believe this duration allows you to fully experience the benefits of our advertising solutions and see a significant return on your investment."
    }
  ]
