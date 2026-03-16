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

export default function MinimalResume({ data, editable, onEdit }: ResumeProps) {
  if (!data) return null;

  return (
    <div className="bg-white text-gray-900 p-10 space-y-5 font-sans w-[794px] min-h-[1123px] mx-auto shadow-2xl">
      {/* Header — centered, clean */}
      <div className="text-center pb-4">
        <EditableText value={data.name} field="name" editable={editable} onEdit={onEdit} className="text-2xl font-semibold block" tag="h1" />
        <EditableText value={data.headline} field="headline" editable={editable} onEdit={onEdit} className="text-gray-500 mt-0.5 block" tag="p" />
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs text-gray-400">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>·</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>·</span>}
          {data.location && <span>{data.location}</span>}
          {data.website && <span>·</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Summary */}
      {(data.bio || editable) && (
        <EditableText value={data.bio} field="bio" editable={editable} onEdit={onEdit} className="text-sm text-gray-600 leading-relaxed text-center max-w-xl mx-auto block" tag="p" />
      )}

      {/* Experience */}
      {data.experiences?.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Experience</h2>
          <div className="space-y-4">
            {data.experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium">{exp.position}</h3>
                    <p className="text-xs text-gray-500">{exp.company}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5">
                    {formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.educations?.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Education</h2>
          <div className="space-y-2">
            {data.educations.map((edu: any) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</h3>
                  <p className="text-xs text-gray-500">{edu.institution}</p>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5">
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
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Projects</h2>
          <div className="space-y-2">
            {data.projects.map((proj: any) => (
              <div key={proj.id} className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium">{proj.title}</h3>
                  {proj.description && <p className="text-xs text-gray-500 mt-0.5">{proj.description}</p>}
                  {proj.techStack?.length > 0 && (
                    <p className="text-[11px] text-gray-400 mt-0.5">{proj.techStack.join(" · ")}</p>
                  )}
                </div>
                <div className="flex gap-2 text-[11px] text-gray-400 whitespace-nowrap mt-0.5">
                  {proj.githubUrl && <a href={proj.githubUrl} className="hover:text-gray-600">GitHub</a>}
                  {proj.liveUrl && <a href={proj.liveUrl} className="hover:text-gray-600">Live</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill: any) => (
              <span key={skill.id} className="px-2 py-0.5 text-xs text-gray-600 bg-gray-50 rounded border border-gray-100">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
