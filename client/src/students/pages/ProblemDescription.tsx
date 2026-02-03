import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import SubmissionResult from '../components/SubmissionResult';

const ProblemDescription: React.FC = () => {
    const { studentId, slug } = useParams<{ studentId: string, slug: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const problem = useSelector((state: RootState) =>
        state.problems.items.find((p) => p.id === slug)
    );

    const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');
    const [activeEditorTab, setActiveEditorTab] = useState<'testcase' | 'testresult'>('testcase');
    const [selectedLanguage, setSelectedLanguage] = useState('Java');
    const [showVerdict, setShowVerdict] = useState(false);
    const [verdict, setVerdict] = useState<{ status: string; runtime?: string; memory?: string }>({ status: '' });

    const userHandle = useSelector((state: RootState) => (state.auth as any).userHandle);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(5400); // 1h 30m in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const handleBack = () => {
        const fromTest = (location.state as any)?.fromTest;
        if (fromTest) {
            navigate(`/student/${studentId}/tests/${fromTest}`);
        } else {
            navigate(`/student/${studentId}/profile`);
        }
    };

    const BOILERPLATES: { [key: string]: string } = {
        'Java': `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
        'Python': `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass`,
        'C++': `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
        'JavaScript': `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`
    };

    const [code, setCode] = useState(BOILERPLATES['Java']);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        setCode(BOILERPLATES[lang]);
    };

    const handleSubmit = () => {
        // Simulate submission with random verdict
        const verdicts = [
            { status: 'Accepted', runtime: '45ms', memory: '42.1MB' },
            { status: 'Wrong Answer', runtime: 'N/A', memory: 'N/A' },
            { status: 'Time Limit Exceeded', runtime: 'N/A', memory: 'N/A' },
            { status: 'Runtime Error', runtime: 'N/A', memory: 'N/A' },
        ];
        const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
        setVerdict(randomVerdict);
        setShowVerdict(true);
    };

    if (!problem) {
        return <div className="p-8 text-center text-gray-500">Problem not found.</div>;
    }

    // Get problem index from mock data or just use items
    const problemIndex = useSelector((state: RootState) =>
        state.problems.items.findIndex(p => p.id === slug) + 1
    );

    return (
        <div className="flex flex-col h-screen bg-bg-main overflow-hidden font-sans">
            {/* Top Navigation Bar */}
            <div className="h-16 bg-bg-card border-b border-border-gray flex items-center justify-between px-6 shrink-0 z-10 transition-colors">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-bg-main rounded-full transition-colors text-text-body hover:text-text-main"
                        title="Back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-text-main tracking-tight">
                        {problem.title}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-main rounded-lg border border-border-gray shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-text-body">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold font-mono text-text-main">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Description */}
                <div className="w-1/2 bg-bg-card flex flex-col overflow-hidden border-r border-border-gray transition-colors">
                    {/* Tabs */}
                    <div className="flex items-center gap-0 px-4 pt-3 pb-0 border-b border-border-gray bg-bg-card shrink-0">
                        {(['description', 'submissions'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                }}
                                className={`px-4 py-2.5 text-xs font-medium capitalize transition-all relative ${activeTab === tab
                                    ? 'text-text-main'
                                    : 'text-text-body hover:text-text-main'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-main"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none">
                        {activeTab === 'description' && (
                            <div className="space-y-5">
                                {/* Problem Title and Badges */}
                                <div className="space-y-3">
                                    <h1 className="text-xl font-semibold text-text-main">
                                        {problemIndex}. {problem.title}
                                    </h1>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${problem.difficulty === 'Easy' ? 'bg-green-600/20 text-green-500' :
                                            problem.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-500' :
                                                'bg-red-600/20 text-red-500'
                                            }`}>
                                            {problem.difficulty}
                                        </span>
                                        <span className="px-2 py-0.5 bg-bg-main text-text-body rounded text-[11px] border border-border-gray">
                                            {problem.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Problem Description */}
                                <div className="text-sm text-text-body leading-relaxed space-y-3">
                                    <div className="whitespace-pre-wrap">{problem.description}</div>
                                </div>

                                {/* Examples (Samples) */}
                                {problem.samples && problem.samples.length > 0 && (
                                    <div className="space-y-3">
                                        {problem.samples.map((sample, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="text-sm font-semibold text-text-main">Example {i + 1}:</div>
                                                <div className="bg-bg-main p-3 rounded-lg border border-border-gray space-y-1.5 font-mono text-xs">
                                                    <div>
                                                        <span className="text-text-body font-semibold">Input:</span>
                                                        <span className="text-text-main ml-2">{sample.input}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-text-body font-semibold">Output:</span>
                                                        <span className="text-text-main ml-2">{sample.output}</span>
                                                    </div>
                                                    {sample.explanation && (
                                                        <div>
                                                            <span className="text-text-body font-semibold">Explanation:</span>
                                                            <span className="text-text-body ml-2">{sample.explanation}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'submissions' && (
                            <div className="h-full">
                                <SubmissionResult userHandle={userHandle} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Code Editor */}
                <div className="w-1/2 bg-bg-card flex flex-col overflow-hidden transition-colors">
                    {/* Editor Header */}
                    <div className="h-11 bg-bg-card border-b border-border-gray flex items-center justify-between px-3 shrink-0">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                            </svg>
                            <span className="text-xs font-medium text-text-main">Code</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                                className="bg-bg-main text-text-main text-[11px] font-medium border border-border-gray rounded px-2 py-1 outline-none hover:bg-bg-main/80 transition-colors"
                            >
                                {Object.keys(BOILERPLATES).map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="h-[55%] overflow-hidden relative bg-bg-main border-b border-border-gray">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full pl-12 pr-4 py-4 font-mono text-[13px] bg-bg-main text-text-main border-none outline-none resize-none selection:bg-primary-blue/20 scrollbar-none overflow-auto leading-relaxed"
                            spellCheck={false}
                        />
                        {/* Line Numbers */}
                        <div className="absolute top-0 left-0 w-10 h-full bg-bg-main border-r border-border-gray/30 pointer-events-none flex flex-col items-end pr-2 pt-4 space-y-[3px] select-none text-text-body/40 text-[11px] font-mono">
                            {code.split('\n').map((_, i: number) => (
                                <div key={i} className="leading-relaxed">{i + 1}</div>
                            ))}
                        </div>
                    </div>

                    {/* Testcase / Test Result Section */}
                    <div className="flex-1 flex flex-col bg-bg-card overflow-hidden">
                        {/* Tabs */}
                        <div className="flex items-center gap-0 px-3 pt-2 pb-0 border-b border-border-gray bg-bg-card shrink-0">
                            <button
                                onClick={() => setActiveEditorTab('testcase')}
                                className={`px-3 py-2 text-xs font-medium transition-all relative ${activeEditorTab === 'testcase'
                                    ? 'text-text-main'
                                    : 'text-text-body hover:text-text-main'
                                    }`}
                            >
                                Testcase
                                {activeEditorTab === 'testcase' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-main"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveEditorTab('testresult')}
                                className={`px-3 py-2 text-xs font-medium transition-all relative flex items-center gap-1.5 ${activeEditorTab === 'testresult'
                                    ? 'text-text-main'
                                    : 'text-text-body hover:text-text-main'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                </svg>
                                Test Result
                                {activeEditorTab === 'testresult' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-main"></div>
                                )}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-3 scrollbar-none">
                            {activeEditorTab === 'testcase' && (
                                <div className="space-y-3">
                                    <div className="text-xs text-text-body">
                                        <div className="mb-2 font-medium text-text-main">nums =</div>
                                        <input
                                            type="text"
                                            defaultValue="[2,7,11,15]"
                                            className="w-full bg-bg-main border border-border-gray rounded px-3 py-2 text-xs text-text-main outline-none focus:border-primary-blue transition-colors font-mono"
                                        />
                                    </div>
                                    <div className="text-xs text-text-body">
                                        <div className="mb-2 font-medium text-text-main">target =</div>
                                        <input
                                            type="text"
                                            defaultValue="9"
                                            className="w-full bg-bg-main border border-border-gray rounded px-3 py-2 text-xs text-text-main outline-none focus:border-primary-blue transition-colors font-mono"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeEditorTab === 'testresult' && (
                                <div className="flex flex-col items-center justify-center h-full text-text-body opacity-50 space-y-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                    </svg>
                                    <p className="text-sm">You must run your code first</p>
                                </div>
                            )}
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="h-10 bg-bg-card border-t border-border-gray flex items-center justify-between px-3 shrink-0">
                            <div className="text-[11px] text-text-body/50">
                                Ln 1, Col 1
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-1.5 text-xs font-semibold text-text-body bg-bg-main border border-border-gray hover:bg-border-gray/30 rounded-lg transition-all active:scale-95">
                                    Run
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verdict Modal */}
            {showVerdict && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVerdict(false)}>
                    <div className="bg-bg-card border border-border-gray rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center space-y-4">
                            {/* Status Icon */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${verdict.status === 'Accepted' ? 'bg-green-600/20' :
                                verdict.status === 'Wrong Answer' ? 'bg-red-600/20' :
                                    verdict.status === 'Time Limit Exceeded' ? 'bg-yellow-600/20' :
                                        'bg-orange-600/20'
                                }`}>
                                {verdict.status === 'Accepted' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-8 h-8 ${verdict.status === 'Wrong Answer' ? 'text-red-600' :
                                        verdict.status === 'Time Limit Exceeded' ? 'text-yellow-600' :
                                            'text-orange-600'
                                        }`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>

                            {/* Status Text */}
                            <h2 className={`text-2xl font-bold ${verdict.status === 'Accepted' ? 'text-green-600' :
                                verdict.status === 'Wrong Answer' ? 'text-red-500' :
                                    verdict.status === 'Time Limit Exceeded' ? 'text-yellow-600' :
                                        'text-orange-500'
                                }`}>
                                {verdict.status}
                            </h2>

                            {/* Details */}
                            {verdict.status === 'Accepted' && (
                                <div className="w-full space-y-2 bg-bg-main rounded-lg p-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-body">Runtime:</span>
                                        <span className="text-text-main font-medium">{verdict.runtime}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-body">Memory:</span>
                                        <span className="text-text-main font-medium">{verdict.memory}</span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 w-full mt-4">
                                <button
                                    onClick={() => setShowVerdict(false)}
                                    className="flex-1 px-4 py-2 bg-bg-main hover:bg-border-gray/30 text-text-main text-sm font-semibold rounded-lg transition-all border border-border-gray"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setShowVerdict(false);
                                        setActiveTab('submissions');
                                    }}
                                    className="flex-1 px-4 py-2 bg-primary-blue hover:bg-primary-blue/90 text-white text-sm font-semibold rounded-lg transition-all"
                                >
                                    View Submissions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProblemDescription;
