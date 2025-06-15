
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-coral mb-2">Treqy</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Your Studio's Material Memory
            </p>
          </div>
          
          <div className="flex justify-center gap-8 mb-8">
            <a href="mailto:hello@treqy.com" className="text-gray-400 hover:text-coral transition-colors duration-200">
              hello@treqy.com
            </a>
            <a href="/terms" className="text-gray-400 hover:text-coral transition-colors duration-200">
              Terms of Service
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-coral transition-colors duration-200">
              Privacy Policy
            </a>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Treqy is an insights tool; it does not replace official cost or compliance consultants.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
