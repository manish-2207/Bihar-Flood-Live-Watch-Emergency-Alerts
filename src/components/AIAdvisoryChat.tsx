import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, PhoneCall, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AIAdvisoryChatProps {
  language: 'en' | 'hi';
}

export const AIAdvisoryChat: React.FC<AIAdvisoryChatProps> = ({ language }) => {
  const isHi = language === 'hi';

  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('Khagaria');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{
    q: string;
    a: string;
    source?: string;
  }[]>([
    {
      q: isHi ? 'बाढ़ का पानी घर में घुसने लगे तो तुरंत क्या करना चाहिए?' : 'Flood water is entering my home, what are the immediate steps?',
      a: isHi
        ? `**तत्काल अनिवार्य सुरक्षा कदम:**
1. **बिजली का मेन स्विच काटें:** पानी सॉकेट या स्विचबोर्ड तक पहुंचने से पहले मुख्य एमसीबी/स्विच तुरंत बंद करें।
2. **ऊंचे स्थान पर जाएं:** बच्चों, बुजुर्गों, आवश्यक दवाओं व दस्तावेजों के साथ छत या पक्के ऊंचे स्थान पर शरण लें।
3. **पीने का पानी सुरक्षित रखें:** किसी भी हालत में नल या चापाकल का दूषित पानी न पिएं। पानी को कम से कम 10 मिनट उबालें या क्लोरीन की गोली (Halazone) डालें।
4. **सांप व बिच्छू से सतर्कता:** पानी के बहाव से बचने के लिए जहरीले जीव सूखे ऊंचे स्थानों पर आ सकते हैं। डंडे और टॉर्च का उपयोग करें।
5. **हेल्पलाइन:** तत्काल बचाव नौका के लिए **1070** (आपदा विभाग) या **06115-253939** (NDRF बिहटा) पर कॉल करें।`
        : `**Immediate Mandatory Safety Protocol:**
1. **Disconnect Main Power:** Shut off your circuit breaker immediately before water reaches wall outlets to prevent lethal electric shocks.
2. **Move to Elevated Ground:** Shift children, elderly family members, essential medication, and ID cards to the roof or designated community shelter.
3. **Disinfect Drinking Water:** Never drink flood runoff or contaminated hand-pump water. Boil water vigorously for 10 minutes or use Chlorine/Halazone tablets.
4. **Beware of Snakes & Scorpions:** Reptiles seek refuge on higher dry perches during water ingress. Carry a walking stick and keep a charged flashlight handy.
5. **Emergency Contact:** Call Bihar Disaster Helpline **1070** or NDRF Bihta **06115-253939** for boat rescue.`
    }
  ]);

  const quickPromptChips = isHi ? [
    'बाढ़ का पानी घर में घुस रहा है, क्या करें?',
    'बाढ़ के पानी को पीने योग्य कैसे बनाएं?',
    'बाढ़ में सांप काटने पर प्राथमिक उपचार क्या है?',
    'पानी में फंसे होने पर बचाव दल को कैसे संकेत दें?',
    'बाढ़ के दौरान होने वाली बीमारियों से कैसे बचें?'
  ] : [
    'Water entering home, immediate safety steps?',
    'How to purify flood water for drinking?',
    'Snakebite emergency protocol during floods',
    'How to signal rescue boats from a marooned roof?',
    'Waterborne diseases prevention during floods'
  ];

  const handleSend = async (questionToSend?: string) => {
    const text = questionToSend || query;
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setQuery('');

    try {
      const res = await fetch('/api/ai-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          language: isHi ? 'hi' : 'en',
          district,
          currentSituation: 'Active Bihar monsoon flood condition'
        })
      });

      const data = await res.json();
      if (data.answer) {
        setConversation(prev => [
          ...prev,
          { q: text, a: data.answer, source: data.source }
        ]);
      }
    } catch (err) {
      console.error('Failed to get advisory:', err);
      setConversation(prev => [
        ...prev,
        {
          q: text,
          a: isHi 
            ? 'सर्वर से संपर्क करने में समस्या हुई। तत्काल सहायता के लिए आपदा हेल्पलाइन 1070 पर कॉल करें।' 
            : 'Could not connect to advisory service. Please dial 1070 directly for immediate emergency rescue.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isHi ? 'बिहार बाढ़ आपातकालीन एआई सलाहकार' : 'AI Emergency Flood Safety Advisor'}
              </h2>
              <span className="bg-blue-950 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isHi 
                ? 'सीडब्ल्यूसी व बीएसडीएमए आपदा प्रोटोकॉल पर आधारित तत्काल जीवन रक्षक मार्गदर्शन' 
                : 'Instant disaster mitigation, water safety, evacuation, and first-aid advisory'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">{isHi ? 'आपका जिला:' : 'District Context:'}</span>
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="bg-slate-950 text-white px-2.5 py-1 rounded border border-slate-700 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="Khagaria">Khagaria</option>
            <option value="Supaul">Supaul</option>
            <option value="Muzaffarpur">Muzaffarpur</option>
            <option value="Darbhanga">Darbhanga</option>
            <option value="Patna">Patna</option>
            <option value="Bhagalpur">Bhagalpur</option>
            <option value="Gopalganj">Gopalganj</option>
            <option value="Samastipur">Samastipur</option>
          </select>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto bg-slate-950/40">
        {conversation.map((msg, idx) => (
          <div key={idx} className="space-y-3">
            {/* User prompt bubble */}
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white text-xs sm:text-sm font-medium py-2.5 px-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-md">
                {msg.q}
              </div>
            </div>

            {/* AI Response bubble */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-800 text-blue-400 rounded-lg shrink-0 mt-1 border border-slate-700">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm py-3.5 px-4 rounded-2xl rounded-tl-none max-w-[90%] space-y-2 shadow-lg leading-relaxed">
                <div className="whitespace-pre-line text-slate-100 font-sans">
                  {msg.a}
                </div>
                {msg.source && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Protocol: {msg.source}</span>
                    <a href="tel:1070" className="text-red-400 font-bold hover:underline flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" />
                      1070 Emergency Desk
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-blue-400 bg-slate-900 p-3 rounded-xl border border-slate-800 w-fit">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>{isHi ? 'आपदा प्रोटोकॉल से सुरक्षा निर्देश तैयार किए जा रहे हैं...' : 'Synthesizing verified emergency safety directives...'}</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
          {isHi ? 'शीघ्र प्रश्न:' : 'Common Questions:'}
        </span>
        {quickPromptChips.map((chip, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(chip)}
            className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            id="ai-advisor-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={
              isHi 
                ? 'बाढ़ सुरक्षा, जल शोधन, बचाव नौका अथवा प्राथमिक उपचार से संबंधित प्रश्न पूछें...' 
                : 'Ask urgent questions about flood safety, evacuation routes, clean water, or snakebite...'
            }
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            id="send-ai-query-btn"
            disabled={isLoading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{isHi ? 'पूछें' : 'Send'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
