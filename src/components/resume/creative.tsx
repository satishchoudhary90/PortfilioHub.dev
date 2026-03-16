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

export default function CreativeResume({ data, editable, onEdit }: ResumeProps) {
  if (!data) return null;

  return (
    <div className="bg-white text-gray-900 flex w-[794px] min-h-[1123px] mx-auto shadow-2xl font-sans">
      {/* Left sidebar */}
      <div className="w-1/3 bg-indigo-900 text-white p-6 space-y-6">
        {/* Avatar / Photo */}
        <div className="flex justify-center">
          {data.image && (
            <img src={data.image} alt="" className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-400/50 mx-auto" />
          )}
          {!data.image && (
            <div className="w-20 h-20 rounded-full bg-indigo-700 flex items-center justify-center text-2xl font-bold mx-auto">
              {(data.name || "D").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </div>
          )}
        </div>

        <div className="text-center">
          <EditableText value={data.name} field="name" editable={editable} onEdit={onEdit} className="text-xl font-bold block" tag="h1" />
          <EditableText value={data.headline} field="headline" editable={editable} onEdit={onEdit} className="text-indigo-200 text-sm mt-1 block" tag="p" />
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">Contact</h2>
          <div className="space-y-1.5 text-xs text-indigo-100">
            {data.email && <p>{data.email}</p>}
            {data.phone && <p>{data.phone}</p>}
            {data.location && <p>{data.location}</p>}
            {data.website && <p>{data.website}</p>}
          </div>
        </div>

        {/* Skills */}
        {data.skills?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">Skills</h2>
            <div className="space-y-2">
              {data.skills.map((skill: any) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-indigo-100">{skill.name}</span>
                    <span className="text-indigo-300">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-400 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {data.socialLinks?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">Links</h2>
            <div className="space-y-1 text-xs text-indigo-100">
              {data.socialLinks.map((link: any) => (
                <p key={link.id} className="capitalize">{link.platform}: <span className="text-indigo-300 break-all">{link.url}</span></p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right content */}
      <div className="flex-1 p-8 space-y-6">
        {/* About */}
        {(data.bio || editable) && (
          <div>
            <h2 className="text-lg font-bold text-indigo-900 border-b-2 border-indigo-200 pb-1 mb-3">About Me</h2>
            <EditableText value={data.bio} field="bio" editable={editable} onEdit={onEdit} className="text-sm text-gray-600 leading-relaxed block" tag="p" />
          </div>
        )}

        {/* Experience */}
        {data.experiences?.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-indigo-900 border-b-2 border-indigo-200 pb-1 mb-3">Experience</h2>
            <div className="space-y-4">
              {data.experiences.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold">{exp.position}</h3>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  {exp.description && (
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-indigo-900 border-b-2 border-indigo-200 pb-1 mb-3">Projects</h2>
            <div className="space-y-3">
              {data.projects.map((proj: any) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold">{proj.title}</h3>
                    <div className="flex gap-2 text-[11px] text-indigo-600">
                      {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">GitHub</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live</a>}
                    </div>
                  </div>
                  {proj.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>}
                  {proj.techStack?.length > 0 && (
                    <p className="text-xs text-indigo-600 mt-0.5">{proj.techStack.join(" · ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.educations?.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-indigo-900 border-b-2 border-indigo-200 pb-1 mb-3">Education</h2>
            <div className="space-y-3">
              {data.educations.map((edu: any) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600">{edu.institution}{edu.grade ? ` — GPA: ${edu.grade}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
