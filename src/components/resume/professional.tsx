"use client";

import { formatDate } from "@/lib/utils";

interface ResumeProps {
  data: any;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
}

function EditableText({ value, field, editable, onEdit, className, tag: Tag = "span" }: {
  value: string; field: string; editable?: boolean;
  onEdit?: (field: string, value: string) => void;
  className?: string; tag?: any;
}) {
  if (!value && !editable) return null;
  return (
    <Tag
      className={`${className || ""} ${editable ? "outline-none ring-1 ring-transparent hover:ring-indigo-400/50 focus:ring-indigo-500 rounded px-0.5 cursor-text" : ""}`}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={(e: any) => editable && onEdit?.(field, e.currentTarget.textContent || "")}
    >
      {value || (editable ? "Click to edit" : "")}
    </Tag>
  );
}

export default function ProfessionalResume({ data, editable, onEdit }: ResumeProps) {
  if (!data) return null;

  return (
    <div className="bg-white text-gray-900 p-10 space-y-6 font-serif w-[794px] min-h-[1123px] mx-auto shadow-2xl">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          {data.image && (
            <img src={data.image} alt="" className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm shrink-0" />
          )}
          <div>
            <EditableText value={data.name} field="name" editable={editable} onEdit={onEdit} className="text-3xl font-bold tracking-tight" tag="h1" />
            <EditableText value={data.headline} field="headline" editable={editable} onEdit={onEdit} className="text-lg text-gray-600 mt-1 block" tag="p" />
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>|&nbsp; {data.phone}</span>}
              {data.location && <span>|&nbsp; {data.location}</span>}
              {data.website && <span>|&nbsp; {data.website}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {(data.bio || editable) && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Professional Summary
          </h2>
          <EditableText value={data.bio} field="bio" editable={editable} onEdit={onEdit} className="text-sm text-gray-700 leading-relaxed block" tag="p" />
        </div>
      )}

      {/* Experience */}
      {data.experiences?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-sm">{exp.position}</h3>
                    <p className="text-sm text-gray-600 italic">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.educations?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {data.educations.map((edu: any) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                  <p className="text-sm text-gray-600 italic">{edu.institution}{edu.grade ? ` — GPA: ${edu.grade}` : ""}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj: any) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm">{proj.title}</h3>
                  <div className="flex gap-2 text-xs text-blue-700">
                    {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">GitHub</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live</a>}
                  </div>
                </div>
                {proj.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>}
                {proj.techStack?.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{proj.techStack.join(" · ")}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Skills
          </h2>
          <p className="text-sm text-gray-700">
            {data.skills.map((s: any) => s.name).join(" • ")}
          </p>
        </div>
      )}

      {/* Social Links */}
      {data.socialLinks?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Links
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-blue-700">
            {data.socialLinks.map((link: any) => (
              <a key={link.id} href={link.url} className="hover:underline capitalize">
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
