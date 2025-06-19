import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, LabelList } from 'recharts';
import { Filter, Users, Send, TrendingUp, Eye, X, Star, BarChart3, Download, Calendar, Target, Activity } from 'lucide-react';

// Sample survey data
const surveyData = [
    {
        id: 1, bu: 'Sidd', name: 'John Smith', client: 'TechCorp Inc', function: 'HR', sent: true, received: true,
        responses: { q1: 4, q2: ['Talent Availability', 'Hiring Speed'], q3: 5, q4: 3, q5: 4, q6: 'No', q7: 5, q8: 'Monthly', q9: 10, q10: 'VDart is among the top vendors we work with', q11: ['Quality of Candidates', 'Speed of Hiring'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    },
    {
        id: 2, bu: 'Rohit', name: 'Sarah Johnson', client: 'FinanceFlow Ltd', function: 'Procurement', sent: true, received: true,
        responses: { q1: 3, q2: ['Cost Control', 'Candidate Quality'], q3: 4, q4: 4, q5: 3, q6: 'Yes', q7: 4, q8: 'Bi-Weekly', q9: 9, q10: 'VDart is our number one preferred staffing partner', q11: ['Pricing and Value', 'Transparency and Communication'], q12: 'No', q13: 'I had some idea, but was not fully aware' }
    },
    {
        id: 3, bu: 'Nambu', name: 'Mike Chen', client: 'DataSystems Corp', function: 'HR', sent: true, received: true,
        responses: { q1: 5, q2: ['Industry-Specific Hiring Challenges'], q3: 5, q4: 5, q5: 5, q6: 'No', q7: 5, q8: 'Weekly', q9: 9, q10: 'VDart is our number one preferred staffing partner', q11: ['Quality of Candidates', 'Innovation in Recruitment Processes'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    },
    {
        id: 4, bu: 'Vinay', name: 'Lisa Rodriguez', client: 'HealthTech Solutions', function: 'Procurement', sent: true, received: false, responses: null
    },
    {
        id: 5, bu: 'Sidd', name: 'David Kim', client: 'RetailMax Inc', function: 'HR', sent: true, received: true,
        responses: { q1: 2, q2: ['Talent Availability', 'Cost Control'], q3: 3, q4: 2, q5: 3, q6: 'Yes', q7: 3, q8: 'Rarely', q9: 8, q10: 'VDart is similar to other vendors we use', q11: ['Pricing and Value'], q12: 'No', q13: 'No, I thought VDart only operated in North America' }
    },
    {
        id: 6, bu: 'Rohit', name: 'Emma Wilson', client: 'ManufacturingPro', function: 'HR', sent: true, received: true,
        responses: { q1: 4, q2: ['Hiring Speed', 'Candidate Quality'], q3: 4, q4: 4, q5: 4, q6: 'No', q7: 4, q8: 'Monthly', q9: 8, q10: 'VDart is among the top vendors we work with', q11: ['Quality of Candidates', 'Transparency and Communication'], q12: 'Yes', q13: 'I had some idea, but was not fully aware' }
    },
    {
        id: 7, bu: 'Nambu', name: 'Alex Thompson', client: 'EcoEnergy Corp', function: 'Procurement', sent: true, received: true,
        responses: { q1: 5, q2: ['Innovation'], q3: 5, q4: 4, q5: 5, q6: 'No', q7: 5, q8: 'Weekly', q9: 10, q10: 'VDart is our number one preferred staffing partner', q11: ['Quality of Candidates', 'Innovation in Recruitment Processes'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    },
    {
        id: 8, bu: 'Vinay', name: 'Maria Gonzalez', client: 'GlobalTech Inc', function: 'HR', sent: true, received: true,
        responses: { q1: 3, q2: ['Talent Availability', 'Industry-Specific Hiring Challenges'], q3: 4, q4: 3, q5: 3, q6: 'Yes', q7: 4, q8: 'Bi-Weekly', q9: 8, q10: 'VDart is similar to other vendors we use', q11: ['Cost Control', 'Quality of Candidates'], q12: 'No', q13: 'I had some idea, but was not fully aware' }
    },
    {
        id: 9, bu: 'Sidd', name: 'Robert Taylor', client: 'InnovateTech', function: 'Procurement', sent: true, received: true,
        responses: { q1: 4, q2: ['Hiring Speed', 'Cost Control'], q3: 4, q4: 3, q5: 4, q6: 'No', q7: 4, q8: 'Monthly', q9: 7, q10: 'VDart is among the top vendors we work with', q11: ['Speed of Hiring', 'Pricing and Value'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    },
    {
        id: 10, bu: 'Rohit', name: 'Jennifer Lee', client: 'BioMed Solutions', function: 'HR', sent: true, received: true,
        responses: { q1: 5, q2: ['Candidate Quality', 'Industry-Specific Hiring Challenges'], q3: 5, q4: 5, q5: 4, q6: 'No', q7: 5, q8: 'Weekly', q9: 9, q10: 'VDart is our number one preferred staffing partner', q11: ['Quality of Candidates', 'Innovation in Recruitment Processes'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    },
    {
        id: 11, bu: 'Nambu', name: 'James Brown', client: 'FinanceMax Corp', function: 'Procurement', sent: true, received: true,
        responses: { q1: 3, q2: ['Cost Control', 'Talent Availability'], q3: 3, q4: 4, q5: 3, q6: 'Yes', q7: 3, q8: 'Occasionally', q9: 6, q10: 'VDart is similar to other vendors we use', q11: ['Pricing and Value', 'Scope of Services Offered'], q12: 'No', q13: 'I had some idea, but was not fully aware' }
    },
    {
        id: 12, bu: 'Vinay', name: 'Amanda Davis', client: 'TechFlow Industries', function: 'HR', sent: true, received: true,
        responses: { q1: 4, q2: ['Hiring Speed', 'Candidate Quality'], q3: 4, q4: 4, q5: 4, q6: 'No', q7: 4, q8: 'Bi-Weekly', q9: 8, q10: 'VDart is among the top vendors we work with', q11: ['Quality of Candidates', 'Speed of Hiring'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    },
    {
        id: 13, bu: 'Sidd', name: 'Michael Johnson', client: 'CloudSys Ltd', function: 'HR', sent: true, received: true,
        responses: { q1: 1, q2: ['Talent Availability', 'Cost Control'], q3: 2, q4: 1, q5: 2, q6: 'Yes', q7: 2, q8: 'Rarely', q9: 3, q10: 'VDart is similar to other vendors we use', q11: ['Pricing and Value'], q12: 'No', q13: 'No, I thought VDart only operated in North America' }
    },
    {
        id: 14, bu: 'Rohit', name: 'Linda Garcia', client: 'MediaTech Corp', function: 'Procurement', sent: true, received: true,
        responses: { q1: 5, q2: ['Innovation', 'Quality'], q3: 5, q4: 5, q5: 5, q6: 'No', q7: 5, q8: 'Weekly', q9: 10, q10: 'VDart is our number one preferred staffing partner', q11: ['Quality of Candidates', 'Innovation in Recruitment Processes'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    },
    {
        id: 15, bu: 'Nambu', name: 'Kevin Martinez', client: 'AutoTech Systems', function: 'HR', sent: true, received: true,
        responses: { q1: 2, q2: ['Talent Availability', 'Cost Control'], q3: 2, q4: 3, q5: 2, q6: 'Yes', q7: 2, q8: 'Rarely', q9: 4, q10: 'VDart is similar to other vendors we use', q11: ['Pricing and Value'], q12: 'No', q13: 'No, I thought VDart only operated in North America' }
    },
    {
        id: 16, bu: 'Sidd', name: 'Patricia White', client: 'DataFlow Corp', function: 'HR', sent: true, received: true,
        responses: { q1: 3, q2: ['Hiring Speed', 'Candidate Quality'], q3: 3, q4: 3, q5: 3, q6: 'No', q7: 3, q8: 'Monthly', q9: 6, q10: 'VDart is among the top vendors we work with', q11: ['Quality of Candidates', 'Speed of Hiring'], q12: 'Yes', q13: 'I had some idea, but was not fully aware' }
    },
    {
        id: 17, bu: 'Rohit', name: 'Thomas Anderson', client: 'NeoTech Inc', function: 'Procurement', sent: true, received: true,
        responses: { q1: 4, q2: ['Innovation', 'Candidate Quality'], q3: 4, q4: 4, q5: 4, q6: 'No', q7: 4, q8: 'Bi-Weekly', q9: 8, q10: 'VDart is among the top vendors we work with', q11: ['Quality of Candidates', 'Innovation in Recruitment Processes'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    },
    {
        id: 18, bu: 'Nambu', name: 'Rachel Green', client: 'GreenTech Solutions', function: 'HR', sent: true, received: true,
        responses: { q1: 5, q2: ['Industry-Specific Hiring Challenges', 'Innovation'], q3: 5, q4: 5, q5: 5, q6: 'No', q7: 5, q8: 'Weekly', q9: 9, q10: 'VDart is our number one preferred staffing partner', q11: ['Quality of Candidates', 'Innovation in Recruitment Processes'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    },
    {
        id: 19, bu: 'Vinay', name: 'Steven Clark', client: 'BuildRight Corp', function: 'Procurement', sent: true, received: true,
        responses: { q1: 2, q2: ['Cost Control', 'Talent Availability'], q3: 2, q4: 2, q5: 2, q6: 'Yes', q7: 2, q8: 'Rarely', q9: 4, q10: 'Others', q11: ['Pricing and Value'], q12: 'No', q13: 'No, I thought VDart only operated in North America' }
    },
    {
        id: 20, bu: 'Sidd', name: 'Jessica Taylor', client: 'SmartSolutions Inc', function: 'HR', sent: true, received: true,
        responses: { q1: 4, q2: ['Hiring Speed', 'Quality'], q3: 4, q4: 4, q5: 4, q6: 'No', q7: 4, q8: 'Monthly', q9: 7, q10: 'VDart is among the top vendors we work with', q11: ['Quality of Candidates', 'Speed of Hiring'], q12: 'Yes', q13: 'Yes, I am fully aware of VDart\'s global presence' }
    }
];

const questions = {
    hr: {
        q1: { text: "How well does VDart understand your staffing requirements and expectations?", type: "rating", scale: 5 },
        q2: { text: "What are the top hiring challenges your organization is facing right now?", type: "multiple", options: ["Talent Availability", "Hiring Speed", "Cost Control", "Candidate Quality", "Industry-Specific Hiring Challenges", "Other"] },
        q3: { text: "How would you rate the overall quality of candidates VDart has provided?", type: "rating", scale: 5 },
        q4: { text: "How satisfied are you with VDart's speed in delivering candidates for your open roles?", type: "rating", scale: 5 },
        q5: { text: "How effectively does VDart act as a strategic hiring partner rather than just a service provider?", type: "rating", scale: 5 },
        q6: { text: "In the past quarter, have you faced any challenges or difficulties while working with VDart?", type: "yesno" },
        q7: { text: "How would you rate the responsiveness and communication of your VDart client partner?", type: "rating", scale: 5 },
        q8: { text: "In the past 3 months, how frequently has your VDart client partner proactively checked in with you?", type: "single", options: ["Weekly", "Bi-Weekly", "Monthly", "Occasionally", "Rarely"] }
    },
    procurement: {
        q9: { text: "On a scale from 0 to 10, how likely are you to recommend VDart to a colleague or business partner?", type: "rating", scale: 10 },
        q10: { text: "Among all the staffing vendors you work with, how does VDart rank in terms of service quality and effectiveness?", type: "single", options: ["VDart is our number one preferred staffing partner", "VDart is among the top vendors we work with", "VDart is similar to other vendors we use", "Others"] },
        q11: { text: "What key factor influences your willingness to continue working with VDart?", type: "multiple", options: ["Quality of Candidates", "Speed of Hiring", "Pricing and Value", "Innovation in Recruitment Processes", "Scope of Services Offered", "Transparency and Communication", "Others"] },
        q12: { text: "Would you be interested in exploring additional services offered by VDart beyond staffing solutions?", type: "yesno" },
        q13: { text: "Are you aware that VDart operates on a global scale, not just in North America?", type: "single", options: ["Yes, I am fully aware of VDart's global presence", "I had some idea, but was not fully aware", "No, I thought VDart only operated in North America", "I am not familiar with VDart's operations"] }
    }
};

const COLORS = {
    primary: '#0078d4',
    chart: ['#0078d4', '#107c10', '#ffb900', '#d13438', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#f59e0b']
};

// NPS Component for 10-scale ratings
const NPSDisplay = ({ questionId, filteredData, stats, onCategoryClick }) => {
    const responses = filteredData.filter(item => item.received && item.responses && item.responses[questionId] !== null && item.responses[questionId] !== undefined);

    // NPS Standard Scale: 0-6 (Detractors), 7-8 (Passive), 9-10 (Promoters)
    const detractors = responses.filter(item => item.responses[questionId] >= 0 && item.responses[questionId] <= 6).length;
    const passive = responses.filter(item => item.responses[questionId] >= 7 && item.responses[questionId] <= 8).length;
    const promoters = responses.filter(item => item.responses[questionId] >= 9 && item.responses[questionId] <= 10).length;
    const total = responses.length;

    const detractorPercent = total > 0 ? (detractors / total) * 100 : 0;
    const passivePercent = total > 0 ? (passive / total) * 100 : 0;
    const promoterPercent = total > 0 ? (promoters / total) * 100 : 0;

    // NPS Score = % Promoters - % Detractors
    const npsScore = promoterPercent - detractorPercent;

    return (
        <div className="mt-8 mb-8">
            <div className="text-center mb-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Net Promoter Score (NPS)</h4>
                <div className="text-4xl font-bold text-blue-600 mb-2">{npsScore.toFixed(1)}</div>
            </div>

            {/* NPS Arc Scale - Exact Replica */}
            <div className="w-full mb-6 flex justify-center">
                <div className="relative">
                    <svg width="300" height="180" viewBox="0 0 300 180">
                        {/* Red section - Detractors */}
                        <path
                            d="M 30 150 A 120 120 0 0 1 80 45"
                            fill="none"
                            stroke="#DC2626"
                            strokeWidth="30"
                            className="cursor-pointer hover:brightness-110 transition-all duration-200"
                            onClick={() => onCategoryClick('detractors')}
                        />

                        {/* Yellow section - Passives */}
                        <path
                            d="M 80 45 A 120 120 0 0 1 150 30"
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="30"
                            className="cursor-pointer hover:brightness-110 transition-all duration-200"
                            onClick={() => onCategoryClick('passive')}
                        />

                        {/* Green section - Promoters */}
                        <path
                            d="M 150 30 A 120 120 0 0 1 270 150"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="30"
                            className="cursor-pointer hover:brightness-110 transition-all duration-200"
                            onClick={() => onCategoryClick('promoters')}
                        />

                        {/* Needle/Arrow - Enhanced */}
                        <g transform={`rotate(${-90 + ((npsScore + 100) / 200) * 180} 150 150)`}>
                            <line
                                x1="150"
                                y1="150"
                                x2="150"
                                y2="50"
                                stroke="#2D3748"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <polygon
                                points="150,45 156,58 144,58"
                                fill="#2D3748"
                            />
                            <circle
                                cx="150"
                                cy="150"
                                r="8"
                                fill="#2D3748"
                            />
                            <circle
                                cx="150"
                                cy="150"
                                r="4"
                                fill="#4A5568"
                            />
                        </g>
                    </svg>

                    {/* Scale labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-sm text-gray-600 font-medium">
                        <span>-100</span>
                        <span>0</span>
                        
                        <span>100</span>
                    </div>
                </div>
            </div>

            {/* NPS Statistics */}
            <div className="grid grid-cols-3 gap-4 text-center">
                <div
                    className="p-4 bg-red-50 rounded-xl border border-red-200 cursor-pointer hover:bg-red-100 transition-all duration-300 hover:shadow-md"
                    onClick={() => onCategoryClick('detractors')}
                >
                    <div className="text-2xl font-bold text-red-600">{detractors}</div>
                    <div className="text-sm font-medium text-red-700">Detractors(0-6)</div>
                    <div className="text-xs text-red-600">{detractorPercent.toFixed(1)}%</div>
                </div>
                <div
                    className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-all duration-300 hover:shadow-md"
                    onClick={() => onCategoryClick('passive')}
                >
                    <div className="text-2xl font-bold text-yellow-600">{passive}</div>
                    <div className="text-sm font-medium text-yellow-700">Passive(7-8)</div>
                    <div className="text-xs text-yellow-600">{passivePercent.toFixed(1)}%</div>
                </div>
                <div
                    className="p-4 bg-green-50 rounded-xl border border-green-200 cursor-pointer hover:bg-green-100 transition-all duration-300 hover:shadow-md"
                    onClick={() => onCategoryClick('promoters')}
                >
                    <div className="text-2xl font-bold text-green-600">{promoters}</div>
                    <div className="text-sm font-medium text-green-700">Promoters(9-10)</div>
                    <div className="text-xs text-green-600">{promoterPercent.toFixed(1)}%</div>
                </div>
            </div>
        </div>
    );
};

// Rating Display Component
const RatingDisplay = ({ questionId, data, stats, question, onRatingClick, onNPSClick, filteredData }) => {
    const totalResponses = stats.totalResponses;

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            {/* Show NPS for 10-scale questions */}
            {question.scale === 10 && (
                <NPSDisplay
                    questionId={questionId}
                    filteredData={filteredData}
                    stats={stats}
                    onCategoryClick={(category) => onNPSClick(category)}
                />
            )}

            {/* Average Rating Header - Only show for 5-scale questions */}
            {question.scale === 5 && (
                <div className="text-center mb-8">
                    <div className="text-base text-gray-600 mb-4">Average Rating</div>

                    {/* Star Display - Green squares with white stars */}
                    <div className="flex items-center justify-center gap-1 mb-6">
                        {Array.from({ length: question.scale }, (_, i) => {
                            const starNumber = i + 1;
                            const isFilledStar = starNumber <= Math.floor(stats.average);
                            const isHalfStar = starNumber === Math.ceil(stats.average) && stats.average % 1 >= 0.5;

                            return (
                                <div key={i} className="relative w-12 h-12">
                                    {isFilledStar ? (
                                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                                            <Star size={24} className="fill-white text-white" />
                                        </div>
                                    ) : isHalfStar ? (
                                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center relative overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                            <Star size={24} className="fill-white text-white" />
                                            <div className="absolute right-0 top-0 w-6 h-12 bg-gray-300 rounded-r-lg"></div>
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                                            <Star size={24} className="fill-white text-white" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stats.average?.toFixed(2)}/5</div>
                </div>
            )}

            {/* Rating Breakdown Table */}
            <div className="border border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm">
                {/* Header Row */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
                    <div className={`grid ${question.scale === 5 ? 'grid-cols-8' : 'grid-cols-13'} text-center text-sm text-gray-700`}>
                        <div className="p-4 border-r border-gray-300 flex items-center justify-center font-semibold">
                            Rating
                        </div>
                        {Array.from({ length: question.scale }, (_, i) => (
                            <div key={i} className="p-4 border-r border-gray-300 flex items-center justify-center font-semibold">
                                {question.scale === 10 ? i : i + 1}
                            </div>
                        ))}
                        {question.scale === 10 && (
                            <div className="p-4 border-r border-gray-300 flex items-center justify-center font-semibold">
                                10
                            </div>
                        )}
                        <div className="p-4 border-r border-gray-300 flex items-center justify-center font-semibold">
                            TOTAL
                        </div>
                        <div className="p-4 flex items-center justify-center font-semibold">
                            AVERAGE
                        </div>
                    </div>
                </div>

                {/* Data Row */}
                <div className="bg-white">
                    <div className={`grid ${question.scale === 5 ? 'grid-cols-8' : 'grid-cols-13'} text-center`}>
                        {/* Rating Icon */}
                        <div className="p-4 border-r border-gray-300 flex items-center justify-center bg-gray-50">
                            <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        </div>

                        {/* Rating Columns */}
                        {Array.from({ length: question.scale }, (_, i) => {
                            const rating = question.scale === 10 ? i : i + 1;
                            const ratingData = data.find(d => d.rating === rating);
                            const count = ratingData ? ratingData.count : 0;
                            const percentage = totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(1) : '0.0';

                            return (
                                <div
                                    key={rating}
                                    className="p-4 border-r border-gray-300 cursor-pointer hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                                    onClick={() => onRatingClick(rating)}
                                >
                                    <div className="text-sm font-medium text-gray-800 mb-1">{percentage}%</div>
                                    <div className="text-lg text-blue-600 font-bold">{count}</div>
                                </div>
                            );
                        })}

                        {question.scale === 10 && (
                            <div
                                className="p-4 border-r border-gray-300 cursor-pointer hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                                onClick={() => onRatingClick(10)}
                            >
                                <div className="text-sm font-medium text-gray-800 mb-1">
                                    {totalResponses > 0 ? ((data.find(d => d.rating === 10)?.count || 0) / totalResponses * 100).toFixed(1) : '0.0'}%
                                </div>
                                <div className="text-lg text-blue-600 font-bold">
                                    {data.find(d => d.rating === 10)?.count || 0}
                                </div>
                            </div>
                        )}

                        {/* Total Column */}
                        <div className="p-4 border-r border-gray-300 font-bold text-gray-800 bg-gray-50">
                            <div className="text-lg">{totalResponses}</div>
                        </div>

                        {/* Weighted Average Column */}
                        <div className="p-4 font-bold text-gray-800 bg-gray-50">
                            <div className="text-lg">{stats.average?.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Pie Chart with Connected Labels
const PieChartWithLabels = ({ data, questionId, onSliceClick }) => {
    const renderLabel = (props) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload } = props;

        if (percent < 0.02) return null;

        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 25;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const x1 = cx + (outerRadius + 5) * Math.cos(-midAngle * RADIAN);
        const y1 = cy + (outerRadius + 5) * Math.sin(-midAngle * RADIAN);

        const displayName = payload.option || payload.name;
        const shortName = displayName && displayName.length > 12 ? `${displayName.substring(0, 12)}...` : displayName;

        return (
            <g>
                <line x1={x1} y1={y1} x2={x} y2={y} stroke="#666" strokeWidth={1} />
                <line x1={x} y1={y} x2={x + (x > cx ? 15 : -15)} y2={y} stroke="#666" strokeWidth={1} />
                <text x={x + (x > cx ? 20 : -20)} y={y - 5} textAnchor={x > cx ? 'start' : 'end'} className="fill-gray-700 text-sm font-medium">
                    {shortName}
                </text>
                <text x={x + (x > cx ? 20 : -20)} y={y + 10} textAnchor={x > cx ? 'start' : 'end'} className="fill-blue-600 text-xs font-bold">
                    {payload.count} ({(percent * 100).toFixed(1)}%)
                </text>
            </g>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart margin={{ top: 30, right: 100, bottom: 30, left: 100 }}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={80}
                    fill="#0078d4"
                    dataKey="count"
                    onClick={(data) => onSliceClick(data.option)}
                    style={{ cursor: 'pointer' }}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS.chart[index % COLORS.chart.length]}
                            stroke="#fff"
                            strokeWidth={2}
                            className="hover:opacity-80 transition-opacity"
                        />
                    ))}
                </Pie>
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                    <p className="font-semibold text-gray-800">{data.option}</p>
                                    <p className="text-blue-600 font-medium">Count: {data.count} ({data.percentage}%)</p>
                                    <p className="text-xs text-gray-500 mt-1">💡 Click to view details</p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

const Dashboard = () => {
    const [selectedBU, setSelectedBU] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const BUs = ['All', 'Sidd', 'Rohit', 'Nambu', 'Vinay'];

    const filteredData = useMemo(() => {
        return selectedBU === 'All' ? surveyData : surveyData.filter(item => item.bu === selectedBU);
    }, [selectedBU]);

    const stats = useMemo(() => {
        const sent = filteredData.filter(item => item.sent).length;
        const received = filteredData.filter(item => item.received).length;
        const responseRate = sent > 0 ? ((received / sent) * 100).toFixed(1) : 0;
        const totalClients = new Set(filteredData.map(item => item.client)).size;

        const validResponses = filteredData.filter(item => item.received && item.responses);
        const allRatings = [];

        validResponses.forEach(item => {
            Object.keys(questions.hr).concat(Object.keys(questions.procurement)).forEach(qId => {
                const question = questions.hr[qId] || questions.procurement[qId];
                if (question.type === 'rating' && item.responses[qId]) {
                    const normalizedScore = question.scale === 5 ? (item.responses[qId] * 2) : item.responses[qId];
                    allRatings.push(normalizedScore);
                }
            });
        });

        const avgSatisfaction = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 0;
        return { sent, received, responseRate, avgSatisfaction, totalClients };
    }, [filteredData]);

    const buAnalysis = useMemo(() => {
        const analysis = BUs.slice(1).map(bu => {
            const buData = filteredData.filter(item => item.bu === bu && item.received && item.responses);

            const allRatings = [];
            buData.forEach(item => {
                Object.keys(questions.hr).concat(Object.keys(questions.procurement)).forEach(qId => {
                    const question = questions.hr[qId] || questions.procurement[qId];
                    if (question.type === 'rating' && item.responses[qId]) {
                        const normalizedScore = question.scale === 5 ? (item.responses[qId] * 2) : item.responses[qId];
                        allRatings.push(normalizedScore);
                    }
                });
            });

            const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length) : 0;
            const sent = surveyData.filter(item => item.bu === bu && item.sent).length;
            const received = buData.length;
            const responseRate = sent > 0 ? ((received / sent) * 100) : 0;

            const promoters = allRatings.filter(rating => rating >= 8).length;
            const promoterRate = allRatings.length > 0 ? ((promoters / allRatings.length) * 100) : 0;

            return {
                bu,
                avgRating: parseFloat(avgRating.toFixed(2)),
                responseRate: parseFloat(responseRate.toFixed(1)),
                totalResponses: received,
                promoterRate: parseFloat(promoterRate.toFixed(1)),
                trend: avgRating > 7 ? 'positive' : avgRating > 5 ? 'neutral' : 'negative'
            };
        });

        return analysis.sort((a, b) => b.avgRating - a.avgRating);
    }, [filteredData]);

    const getQuestionData = (questionId) => {
        const question = questions.hr[questionId] || questions.procurement[questionId];
        const responses = filteredData.filter(item => item.received && item.responses).map(item => item.responses[questionId]).filter(response => response !== null && response !== undefined);

        if (question.type === 'rating') {
            const counts = {};
            const startValue = question.scale === 10 ? 0 : 1;
            const endValue = question.scale;

            for (let i = startValue; i <= endValue; i++) {
                counts[i] = 0;
            }

            responses.forEach(response => {
                if (counts[response] !== undefined) counts[response]++;
            });

            return Object.entries(counts).map(([rating, count]) => ({
                rating: parseInt(rating),
                count,
                percentage: responses.length > 0 ? ((count / responses.length) * 100).toFixed(1) : 0
            }));
        } else if (question.type === 'multiple') {
            const counts = {};
            question.options.forEach(option => counts[option] = 0);
            responses.forEach(response => {
                if (Array.isArray(response)) {
                    response.forEach(option => {
                        if (counts[option] !== undefined) counts[option]++;
                    });
                }
            });
            return Object.entries(counts).map(([option, count]) => ({
                option,
                count,
                percentage: responses.length > 0 ? ((count / responses.length) * 100).toFixed(1) : 0
            }));
        } else {
            const counts = {};
            responses.forEach(response => {
                counts[response] = (counts[response] || 0) + 1;
            });
            return Object.entries(counts).map(([option, count]) => ({
                option,
                count,
                percentage: responses.length > 0 ? ((count / responses.length) * 100).toFixed(1) : 0
            }));
        }
    };

    const getQuestionStats = (questionId) => {
        const question = questions.hr[questionId] || questions.procurement[questionId];
        const responses = filteredData.filter(item => item.received && item.responses).map(item => item.responses[questionId]).filter(response => response !== null && response !== undefined);
        const totalResponses = responses.length;
        const totalPossible = filteredData.filter(item => item.received).length;
        const responseRate = totalPossible > 0 ? ((totalResponses / totalPossible) * 100).toFixed(1) : 0;

        let average = null;
        if (question.type === 'rating') {
            const sum = responses.reduce((acc, curr) => acc + curr, 0);
            average = responses.length > 0 ? (sum / responses.length) : 0;
        }

        return { totalResponses, responseRate, average };
    };

    const getRespondentsByRating = (questionId, rating) => {
        return filteredData.filter(item => {
            if (!item.received || !item.responses) return false;
            return item.responses[questionId] === rating;
        }).map(item => ({
            bu: item.bu,
            name: item.name,
            client: item.client,
            function: item.function,
            response: item.responses[questionId]
        }));
    };

    const getRespondentsByOption = (questionId, option) => {
        const question = questions.hr[questionId] || questions.procurement[questionId];

        return filteredData.filter(item => {
            if (!item.received || !item.responses) return false;
            const response = item.responses[questionId];

            if (question.type === 'multiple') {
                return Array.isArray(response) && response.includes(option);
            } else {
                return response === option;
            }
        }).map(item => ({
            bu: item.bu,
            name: item.name,
            client: item.client,
            function: item.function,
            response: item.responses[questionId]
        }));
    };

    const getRespondentsByNPS = (questionId, category) => {
        return filteredData.filter(item => {
            if (!item.received || !item.responses) return false;
            const response = item.responses[questionId];
            if (response === null || response === undefined) return false;

            if (category === 'detractors') {
                return response >= 0 && response <= 6;
            } else if (category === 'passive') {
                return response >= 7 && response <= 8;
            } else if (category === 'promoters') {
                return response >= 9 && response <= 10;
            }
            return false;
        }).map(item => ({
            bu: item.bu,
            name: item.name,
            client: item.client,
            function: item.function,
            response: item.responses[questionId]
        }));
    };

    const getAllResponses = (questionId) => {
        return filteredData.filter(item => {
            if (!item.received || !item.responses) return false;
            const response = item.responses[questionId];
            return response !== null && response !== undefined;
        }).map(item => ({
            bu: item.bu,
            name: item.name,
            client: item.client,
            function: item.function,
            response: item.responses[questionId],
            responseDisplay: Array.isArray(item.responses[questionId])
                ? item.responses[questionId].join(', ')
                : item.responses[questionId].toString()
        }));
    };

    const handleNPSClick = (questionId, category) => {
        const respondents = getRespondentsByNPS(questionId, category);
        const question = questions.hr[questionId] || questions.procurement[questionId];

        const categoryNames = {
            'detractors': 'Detractors (0-6)',
            'passive': 'Passive (7-8)',
            'promoters': 'Promoters (9-10)'
        };

        setModalData({
            title: question.text,
            category: categoryNames[category],
            respondents
        });
        setShowModal(true);
    };

    const handleRatingClick = (questionId, rating) => {
        const respondents = getRespondentsByRating(questionId, rating);
        const question = questions.hr[questionId] || questions.procurement[questionId];

        setModalData({
            title: question.text,
            category: `Rating ${rating}`,
            respondents
        });
        setShowModal(true);
    };

    const handleSliceClick = (questionId, option) => {
        const respondents = getRespondentsByOption(questionId, option);
        const question = questions.hr[questionId] || questions.procurement[questionId];

        setModalData({
            title: question.text,
            category: option,
            respondents
        });
        setShowModal(true);
    };

    const handleViewAll = (questionId) => {
        const respondents = getAllResponses(questionId);
        const question = questions.hr[questionId] || questions.procurement[questionId];

        setModalData({
            title: question.text,
            category: 'All Responses',
            respondents
        });
        setShowModal(true);
    };

    const renderQuestion = (questionId, title) => {
        const data = getQuestionData(questionId);
        const stats = getQuestionStats(questionId);
        const question = questions.hr[questionId] || questions.procurement[questionId];

        if (question.type === 'rating') {
            return (
                <div className="mb-12">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        <button
                            onClick={() => handleViewAll(questionId)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Eye size={16} />
                            <span>View All</span>
                        </button>
                    </div>
                    <RatingDisplay
                        questionId={questionId}
                        data={data}
                        stats={stats}
                        question={question}
                        filteredData={filteredData}
                        onRatingClick={(rating) => handleRatingClick(questionId, rating)}
                        onNPSClick={(category) => handleNPSClick(questionId, category)}
                    />
                </div>
            );
        } else {
            return (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-12">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        <button
                            onClick={() => handleViewAll(questionId)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Eye size={16} />
                            <span>View All</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <PieChartWithLabels
                            data={data}
                            questionId={questionId}
                            onSliceClick={(option) => handleSliceClick(questionId, option)}
                        />

                        <div className="space-y-4">
                            {data.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg cursor-pointer hover:from-blue-50 hover:to-blue-100 transition-all duration-300 hover:shadow-md"
                                    onClick={() => handleSliceClick(questionId, item.option)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-6 h-6 rounded-full shadow-sm"
                                            style={{ backgroundColor: COLORS.chart[index % COLORS.chart.length] }}
                                        ></div>
                                        <span className="text-sm font-medium text-gray-700" title={item.option}>
                                            {item.option?.length > 30 ? `${item.option.substring(0, 30)}...` : item.option}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-800">{item.count}</div>
                                        <div className="text-xs text-blue-600 font-medium">{item.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>
                                Total Responses: <span className="font-semibold text-gray-800">{stats.totalResponses}</span>
                            </span>
                            <span>
                                Response Rate: <span className="font-semibold text-blue-600">{stats.responseRate}%</span>
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
    }



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-md border-b border-gray-200">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">VDart Client Satisfaction Dashboard</h1>
                            <p className="text-gray-600 text-lg mt-2">Survey Analytics & Insights</p>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                                <Calendar size={18} />
                                <span className="font-medium">Updated: {new Date().toLocaleDateString()}</span>
                            </div>
                            <button className="flex items-center space-x-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                                <Download size={18} />
                                <span>Export Dashboard</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Filter className="w-6 h-6 text-blue-600" />
                                </div>
                                <label className="text-lg font-semibold text-gray-700">Business Unit Filter:</label>
                            </div>
                            <select
                                value={selectedBU}
                                onChange={(e) => setSelectedBU(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
                            >
                                {BUs.map(bu => (
                                    <option key={bu} value={bu}>{bu}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Enhanced KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-4 bg-blue-500 rounded-xl shadow-md">
                                    <Send className="w-8 h-8 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Surveys Sent</p>
                                    <p className="text-3xl font-bold text-blue-900 mt-1">{stats.sent}</p>
                                    <p className="text-xs text-blue-600 mt-1">Total distributed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-4 bg-green-500 rounded-xl shadow-md">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Responses</p>
                                    <p className="text-3xl font-bold text-green-900 mt-1">{stats.received}</p>
                                    <p className="text-xs text-green-600 mt-1">Completed surveys</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-4 bg-purple-500 rounded-xl shadow-md">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Response Rate</p>
                                    <p className="text-3xl font-bold text-purple-900 mt-1">{stats.responseRate}%</p>
                                    <p className="text-xs text-purple-600 mt-1">Engagement level</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-4 bg-orange-500 rounded-xl shadow-md">
                                    <Star className="w-8 h-8 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">Avg Satisfaction</p>
                                    <p className="text-3xl font-bold text-orange-900 mt-1">{stats.avgSatisfaction}</p>
                                    <p className="text-xs text-orange-600 mt-1">Overall rating</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Enhanced BU Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* BU Performance Ranking */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">BU Performance Ranking</h2>
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <Target className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {buAnalysis.map((bu, index) => (
                                <div key={bu.bu} className={`p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${index === 0 ? 'border-green-300 bg-gradient-to-r from-green-50 to-green-100' :
                                    index === 1 ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100' :
                                        index === 2 ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100' :
                                            'border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${index === 0 ? 'bg-green-500' :
                                                index === 1 ? 'bg-blue-500' :
                                                    index === 2 ? 'bg-orange-500' :
                                                        'bg-gray-500'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-lg">{bu.bu} BU</div>
                                                <div className="text-sm text-gray-600">{bu.totalResponses} responses</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-gray-800">{bu.avgRating}/10</div>
                                            <div className={`text-sm font-medium ${bu.trend === 'positive' ? 'text-green-600' :
                                                bu.trend === 'neutral' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {bu.trend === 'positive' ? '↗ Excellent' :
                                                    bu.trend === 'neutral' ? '→ Good' :
                                                        '↘ Needs Improvement'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BU Comparison Chart */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Overall Rating Comparison</h2>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={buAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="bu" tick={{ fontSize: 12, fontWeight: 500 }} />
                                <YAxis domain={[0, 10]} tick={{ fontSize: 12, fontWeight: 500 }} />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
                                                    <p className="font-semibold text-gray-800 mb-1">{label} BU</p>
                                                    <p className="text-blue-600 font-medium">Average Rating: {data.avgRating}/10</p>
                                                    <p className="text-green-600 font-medium">Promoter Rate: {data.promoterRate}%</p>
                                                    <p className="text-gray-600">Total Responses: {data.totalResponses}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="avgRating" fill="#0078d4" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="avgRating" position="top" fontSize={11} fontWeight="bold" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Promoter Analysis */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Promoter Rate Analysis</h2>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Activity className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={buAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="bu" tick={{ fontSize: 12, fontWeight: 500 }} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fontWeight: 500 }} />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
                                                    <p className="font-semibold text-gray-800 mb-1">{label} BU</p>
                                                    <p className="text-green-600 font-medium">Promoter Rate: {data.promoterRate}%</p>
                                                    <p className="text-blue-600 font-medium">Average Rating: {data.avgRating}/10</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="promoterRate"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                                    activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                                >
                                    <LabelList dataKey="promoterRate" position="top" fontSize={11} fontWeight="bold" formatter={(value) => `${value}%`} />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* HR Questions Section */}
                <div className="mb-16">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg mb-8 border border-blue-200">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-xl shadow-md">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">HR Questions (Q1-Q8)</h2>
                                <p className="text-blue-700 font-medium">Human Resources Survey Insights</p>
                            </div>
                        </div>
                    </div>

                    {Object.entries(questions.hr).map(([qId, question]) => (
                        <div key={qId}>
                            {renderQuestion(qId, `${qId.toUpperCase()}: ${question.text}`)}
                        </div>
                    ))}
                </div>

                {/* Procurement Questions Section */}
                <div className="mb-16">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl shadow-lg mb-8 border border-green-200">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-100 rounded-xl shadow-md">
                                <Target className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Procurement Questions (Q9-Q13)</h2>
                                <p className="text-green-700 font-medium">Procurement & Strategy Survey Insights</p>
                            </div>
                        </div>
                    </div>

                    {Object.entries(questions.procurement).map(([qId, question]) => (
                        <div key={qId}>
                            {renderQuestion(qId, `${qId.toUpperCase()}: ${question.text}`)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-16">
                <div className="container mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold mb-4">VDart Client Satisfaction Dashboard</h3>
                            <p className="text-gray-300 mb-4">
                                Comprehensive analytics and insights platform for measuring client satisfaction
                                and driving continuous improvement in our service delivery.
                            </p>
                            <div className="flex space-x-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-300">
                                    <Calendar size={16} />
                                    <span>Last Updated: {new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Quick Stats</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex justify-between">
                                    <span>Total Surveys:</span>
                                    <span className="font-semibold">{stats.sent}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Response Rate:</span>
                                    <span className="font-semibold">{stats.responseRate}%</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Avg Satisfaction:</span>
                                    <span className="font-semibold">{stats.avgSatisfaction}/10</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Active Clients:</span>
                                    <span className="font-semibold">{stats.totalClients}</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contact & Support</h4>
                            <div className="space-y-2 text-gray-300">
                                <p className="text-sm">Analytics Team</p>
                                <p className="text-sm">dashboard@vdart.com</p>
                                <p className="text-sm">+1 (555) 123-4567</p>
                                <div className="mt-4">
                                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                        Export Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                © 2024 VDart Inc. All rights reserved. | Built with advanced analytics for client success.
                            </p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <span className="text-gray-400 text-xs">Version 2.1.0</span>
                                <span className="text-gray-400 text-xs">Last Sync: {new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Modal */}
            {showModal && modalData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg max-w-6xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Response Details</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 mb-2">
                                <strong>Question:</strong> {modalData.title}
                            </p>
                            <p className="text-gray-700">
                                <strong>Filter:</strong> {modalData.category} ({modalData.respondents.length} respondents)
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">BU</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Client</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Function</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Response</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.respondents.map((respondent, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 border-b">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                    {respondent.bu}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 border-b">{respondent.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 border-b">{respondent.client}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 border-b">
                                                <span className={`px-3 py-1 rounded-full text-sm ${respondent.function === 'HR' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {respondent.function}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 border-b">
                                                {respondent.responseDisplay || respondent.response}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;