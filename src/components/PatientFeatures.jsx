import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Pre-define icons
const CalendarCheckIcon = getIcon('CalendarCheck');
const SmartphoneIcon = getIcon('Smartphone');
const MessagesSquareIcon = getIcon('MessageSquare');
const ClockIcon = getIcon('Clock');
const FileTextIcon = getIcon('FileText');
const BellIcon = getIcon('Bell');
const HeartPulseIcon = getIcon('HeartPulse');
const ShieldCheckIcon = getIcon('ShieldCheck');
const UserCogIcon = getIcon('UserCog');
const HandIcon = getIcon('Hand');
const UsersIcon = getIcon('Users');
const WheelchairIcon = getIcon('Wheelchair');
const LanguagesIcon = getIcon('Languages');
const HospitalIcon = getIcon('Building2');
const CheckIcon = getIcon('Check');
const StarIcon = getIcon('Star');

function PatientFeatures() {
  const featureCategories = [
    {
      title: "Accessibility",
      description: "Features that make healthcare accessible to everyone",
      color: "from-blue-400 to-blue-600",
      icon: WheelchairIcon,
      features: [
        { name: "Multilingual Support", icon: LanguagesIcon, description: "Interface available in multiple languages" },
        { name: "Accessibility Design", icon: HandIcon, description: "Built with accessibility standards in mind" },
        { name: "Location Services", icon: HospitalIcon, description: "Find the nearest healthcare facilities" }
      ]
    },
    {
      title: "Communication",
      description: "Stay connected with your healthcare providers",
      color: "from-green-400 to-green-600",
      icon: MessagesSquareIcon,
      features: [
        { name: "Secure Messaging", icon: ShieldCheckIcon, description: "HIPAA-compliant communication with your doctor" },
        { name: "Appointment Reminders", icon: BellIcon, description: "Timely notifications about upcoming visits" },
        { name: "Results Notification", icon: FileTextIcon, description: "Be notified when your test results are ready" }
      ]
    },
    {
      title: "Convenience",
      description: "Making healthcare fit into your busy life",
      color: "from-purple-400 to-purple-600", 
      icon: ClockIcon,
      features: [
        { name: "Online Scheduling", icon: CalendarCheckIcon, description: "Book appointments anytime, anywhere" },
        { name: "Mobile App Access", icon: SmartphoneIcon, description: "Manage your health from your smartphone" },
        { name: "Quick Check-in", icon: CheckIcon, description: "Skip the line with digital check-in" }
      ]
    },
    {
      title: "Empowerment",
      description: "Tools that help you take control of your health",
      color: "from-red-400 to-red-600",
      icon: UserCogIcon,
      features: [
        { name: "Health Records Access", icon: FileTextIcon, description: "View your complete medical history" },
        { name: "Vitals Monitoring", icon: HeartPulseIcon, description: "Track important health metrics over time" },
        { name: "Family Accounts", icon: UsersIcon, description: "Manage healthcare for your loved ones" }
      ]
    }
  ];

  return (
    <div className="mt-8 mb-4">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">
          Patient-Centered Features
        </h3>
        <p className="text-surface-600 dark:text-surface-400 max-w-3xl">
          MediFlow is designed with patients in mind. Our system includes numerous features that enhance the patient experience and make healthcare more accessible, convenient, and empowering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featureCategories.map((category, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-surface-800 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-sm"
          >
            <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
            <div className="p-5">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                  <category.icon size={20} />
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-surface-800 dark:text-surface-100">{category.title}</h4>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{category.description}</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {category.features.map((feature, featureIndex) => (
                  <motion.li 
                    key={featureIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + (featureIndex * 0.1) }}
                    className="flex p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-600 dark:text-surface-300 mr-3 flex-shrink-0">
                      <feature.icon size={16} />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-surface-800 dark:text-surface-100">{feature.name}</h5>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PatientFeatures;